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