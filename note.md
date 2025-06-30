- You can create names for your images so that they can easily be accessible from other areas in your React Project.

``` JavaScript

import logo from './logo.svg'
import marvelLogo from './marvelLogo.svg'
import googlePlay from './googlePlay.svg'
import appStore from './appStore.svg'
import screenImage from './screenImage.svg'
import profile from './profile.png'

export const assets = {
    logo,
    marvelLogo,
    googlePlay,
    appStore,
    screenImage,
    profile
}

```

- Pages are still components, its just a mere convention.

- You can get information about the current location of the window by using the useLocation hook provided by react-router-dom

``` javascript

const isAdminRoute = useLocation.pathname.startsWith('/admin');

```

- We will be using clerk for our authentication.


# Tailwinds Mobile First Approach

- Tailwind css employs a mobile first approach, this means that the styles you apply will apply to small screens upwards. Tailwind provides breakpoints, those breakpoints when applied, changes the takes effect from that screen size upwards, instead of downwards like using normal media queries with max-width in vanila css.

e.g

``` html

<div className='text-red-400 md:text-green-900'>This is a text</div>

```

- Red styling will be applied from smaller screens up, then when it gets to the medium screen, from that width up, the text will be green.

# Prebuilt ui

- You can use prebuilt ui for free reusable components so you dont have to build them from scratch on your own.