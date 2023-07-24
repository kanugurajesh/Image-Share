# Image Share

A brief description of what this project does and who it's for. Provide a clear and concise overview of the project's purpose and target audience.

## Setup

Follow these steps to set up the project:

1. Run `npm install` to install the required dependencies.
2. Add your API keys in the `.env.local` file. Ensure you have the necessary keys from the following services:

   - **Supabase**:
     - Create an app on Supabase and obtain the public URL and anonymous key. Add these values to the `.env.local` file.

   - **Firebase**:
     - Create a Firebase storage and get the URL and API key. Add these values to the `.env.local` file.

   - **MongoDB**:
     - Copy the MongoDB URL and add it to the `.env.local` file.

3. Run `npm run dev` to start the application.

## Getting the API keys

Follow these steps to obtain the API keys for the required services:

1. **Supabase**:
   - Go to the Supabase website and create an app.
   - Obtain the public URL and anonymous key from your app settings.
   - Add these values to the `.env.local` file.

2. **Firebase**:
   - Go to the Firebase website and create a Firebase storage.
   - Get the storage URL and API key.
   - Add these values to the `.env.local` file.

3. **MongoDB**:
   - Obtain the MongoDB URL from your MongoDB provider.
   - Add the URL to the `.env.local` file.
