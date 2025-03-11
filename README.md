# teenyicons-react

A React component library for [Teenyicons](https://teenyicons.com/) - tiny minimal 1px icons designed by [rebellenoire](https://teenyicons.com/) with the viewer developed by [\_smhmd](https://teenyicons.com/).

## About

This is an unofficial React port of the Teenyicons library. The original icons are designed by rebellenoire and the viewer is developed by \_smhmd. This project aims to make these beautiful icons easily accessible in React applications.

### Features

- 🎯 Over 1000 pixel-perfect icons
- 📦 Two variants for each icon (Outline & Solid)
- ⚡️ Zero dependencies
- 🎨 Customizable size, color, and stroke width
- 💻 TypeScript support
- 🔍 Tree-shakeable exports

## Installation

```bash
npm install @tonerow/teenyicons-react
# or
yarn add @tonerow/teenyicons-react
# or
bun add @tonerow/teenyicons-react
```

## Usage

```jsx
import {
  AddOutline,
  HomeOutline,
  UserOutline,
} from "@tonerow/teenyicons-react";

function App() {
  return (
    <div>
      <AddOutline />
      <HomeOutline />
      <UserOutline />
    </div>
  );
}
```

### Icon Variants

Each icon comes in two variants:

- Outline (default)
- Solid

Example usage of both variants:

```jsx
import {
  HomeOutline,
  HomeSolid,
  UserOutline,
  UserSolid,
} from "@tonerow/teenyicons-react";

function App() {
  return (
    <div>
      <HomeOutline /> {/* Outline variant */}
      <HomeSolid /> {/* Solid variant */}
      <UserOutline />
      <UserSolid />
    </div>
  );
}
```

## Props

All icons accept the following props:

- `size`: Number (default: 15)
- `color`: String (default: "currentColor")
- `strokeWidth`: Number (default: 1.5)
- `className`: String (optional)

## Development

To install dependencies:

```bash
bun install
```

To generate the React components:

```bash
bun run scripts/generate.ts
```

## License

This project is licensed under the MIT License

## Attribution & Transfer Offer

This is an unofficial React port of Teenyicons. The original icons are created by [rebellenoire](https://teenyicons.com/) and the viewer is developed by [\_smhmd](https://teenyicons.com/). All credit for the original icons goes to them.

The original Teenyicons project was designed in South Africa and developed in Morocco, showcasing the incredible talent and collaboration across the African continent.

I would be happy to transfer ownership of this project to the original Teenyicons team if they would like to maintain it officially. This project was created out of appreciation for their work and to make these icons more accessible to the React community. Please reach out if you'd like to discuss transferring ownership or integrating this work into the official Teenyicons repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
