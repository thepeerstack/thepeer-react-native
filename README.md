# thepeer-react-native

react-native sdk for thepeer

<img src='/src/assets/images/screenshot-mobile.jpeg' alt='image of SDK' width='250px'>


## Installation

```sh
npm install thepeer-react-native
```

## Usage

```js
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { ThePeer } from 'thepeer-react-native';
// ...

const WhateverComponent = () => {
  // ...
  const [openThePeerSdk, setOpenThePeerSdk] = useState(false);
  // ...

  return (
    <View
      style={
        {
          // ...
        }
      }
    >
      // ...
      <ThePeer
        {...{
          publicKey: 'PUBLIC_KEY',
          userReference: 'USER_REFERENCE',
          receiptUrl: 'CALLBACK_URL',
          amount: 'AMOUNT_IN_KOBO',
          openThePeerSdk,
          onSuccess: (response) => console.log(response),
          onError: (response) => console.log(response),
          onClose: () => setOpenThePeerSdk(false),
        }}
      />
      <Pressable onPress={() => setOpenThePeerSdk(true)}>
        <Text>Send Money (Peerstack)</Text>
      </Pressable>
      // ...
    </View>
  );
};
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
