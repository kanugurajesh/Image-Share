"use client";
import './app.css';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '@/pages/api/firebase';
import { ref, listAll,getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Progress, Space, Input, Button, Image} from 'antd';
import {FileImageOutlined, FormOutlined,UploadOutlined} from '@ant-design/icons';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [session, setSession] = useState(null)
  const [showForm, setShowForm] = useState(true)
  const [getImages, setGetImages] = useState([]);
  const id = uuidv4();

  const handleFileUpload = () => {
    document.querySelector('#file').click();
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchImages = async () => {
    const listRef = ref(storage, 'files');
    const res = await listAll(listRef);
    const res2 = await Promise.all(
      res.items.map((imageRef) => getDownloadURL(imageRef))
    );
    setGetImages(res2);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const submitForm = async (e) => {
    console.log('submitForm')
    e.preventDefault();
    setLoading(true);
    const file = document.querySelector('#file').files[0];
    if (!file) return;
    const storageRef = ref(storage, `files/${id}`);
    const uploadTask = uploadBytesResumable(storageRef, file, { customMetadata: { id: id } });

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImgUrl(downloadURL);
          const res = await fetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify({
              id: id,
              name: name,
              gmail: gmail,
              password: password,
              imgUrl: downloadURL // Use the downloadURL obtained from Firebase
            }),
          });
        }
        catch (e) {
          console.log(e);
        }
      }
    );
    setName('');
    setGmail('');
    setPassword('');
    setImgUrl(null);
    setProgresspercent(0);
    setLoading(false);
    document.querySelector('#file').value = '';
  };

  if (!session) {
    return (
      <div id='session'>
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['github']}/>
      </div>
    )
  }
  else {
    if(showForm){
      return (
        <div id='layerdiv'>
          <div id='outerdiv'>
            <h1> <FormOutlined style={{ fontSize: '35px', color: '#08c',marginRight:'10px' }}/> My Form</h1>
            <form onSubmit={submitForm} id='outerform'>
              <Input placeholder="name" type='text' id='name' required value={name} onChange={(e)=>{
                setName(e.target.value);
              }}/>
              <Input placeholder="gmail" type='text' id='gmail'  value={gmail} onChange={(e)=>{
                setGmail(e.target.value);
              }} required/>
              <Space direction="horizontal">
                <Input.Password
                  placeholder="input password"
                  id='password'
                  visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                  value={password}
                  onChange={(e)=>{
                    setPassword(e.target.value);
                  }}
                  required
                />
                <Button style={{ width: 80 }} onClick={() => setPasswordVisible((prevState) => !prevState)}>
                  {passwordVisible ? 'Hide' : 'Show'}
                </Button>
              </Space>
              <input type='file' id='file' style={{display:'none'}} required/>
              <Button icon={<UploadOutlined />} onClick={handleFileUpload}>Click to Upload</Button>
              <Button type="primary" onClick={submitForm}>{loading ? 'Loading...' : 'Submit'}</Button>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="dashed" onClick={()=>{
                  setShowForm(false);
                }} block>See all images uploaded by users</Button>
              </Space>
            </form>
            {!imgUrl && (
              <Progress type="circle" percent={progresspercent} />
            )}
            {imgUrl && <Image
              width={200}
              src={imgUrl}
              alt={imgUrl}
              key={uuidv4()}
              />}
          </div>
        </div>
      );
    }
    else{
      return (
        <div id='showimage'>
            <h1> <FileImageOutlined style={{ fontSize: '35px', color: '#08c',marginRight:'10px' }}/> My Images</h1>
            <div id='imagediv'>
              {getImages.map((image) => (
                <Image
                  width={200}
                  height={200}
                  src={image}
                  key={uuidv4()}
                  alt={image}
                />
              ))}
            </div>  
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="dashed" onClick={()=>{
                setShowForm(true);
              }
              } block>Upload your image</Button>
            </Space>
        </div>
      );
    }
  }
}