
# Next.js Instagram Gallery

This project is a lightweight, well-designed Instagram gallery built with Next.js, TypeScript, and Tailwind CSS. It uses an Instagram access token to fetch and display images in a modern, responsive grid layout.

## Features
- Fetches images from Instagram using an access token
- Responsive, visually appealing gallery
- Built with Next.js (App Router), TypeScript, Tailwind CSS
- Lightweight and fast

## Getting Started
1. **Install dependencies** (already done):
	```bash
	npm install
	```
2. **Set your Instagram Access Token**:
	- Create a `.env.local` file in the project root:
	  ```env
	  INSTAGRAM_ACCESS_TOKEN=your_access_token_here
	  ```
3. **Run the development server**:
	```bash
	npm run dev
	```
4. **Open [http://localhost:3000](http://localhost:3000)** to view the gallery.

## Customization
- Update the gallery design in `src/app/page.tsx` and styles in `tailwind.config.js` as needed.
- Replace placeholder logic with your own Instagram API integration.

## License
MIT
