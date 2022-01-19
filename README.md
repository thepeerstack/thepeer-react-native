# Thepeer React Native SDK

Thepeer is a quick and secure way to send money across any business. The SDK handles connecting other businesses to your app.

<img src='https://user-images.githubusercontent.com/23347440/130235552-28306fee-38ad-4879-8a75-650ebacdff07.png' alt='screenshot of Send SDK' width='250px' />
<img src='https://user-images.githubusercontent.com/23347440/130235545-49ed32ee-31fe-4c63-8967-117b96bf52f3.png' alt='screenshot of Direct Charge SDK' width='250px' />

## Installation

```sh
npm install thepeer-react-native
```

Also, install `react-native-webview` because it's a dependency for this package. Here's a [link](https://github.com/react-native-webview/react-native-webview) to their docs.

## Usage

```js
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import {
  ThePeerSend,
  ThePeerDirectCharge,
  ThePeerCheckout,
} from 'thepeer-react-native';
// ...

const sendMoneyApp = () => {
  const [openSendSDK, setOpenSendSDK] = useState(false);
  return (
    <View>
      <ThePeerSend
        {...{
          publicKey: 'PUBLIC_KEY',
          userReference: 'USER_REFERENCE',
          amount: 'AMOUNT_IN_KOBO',
          currency: 'NGN',
          openSendSDK,
          onSuccess: (response) => {},
          onError: (response) => {},
          onClose: () => setOpenSendSDK(false),
        }}
      />
      <Pressable onPress={() => setOpenSendSDK(true)}>
        <Text>Send</Text>
      </Pressable>
    </View>
  );
};

const directChargeApp = () => {
  const [openDirectChargeSDK, setOpenDirectChargeSDK] = useState(false);
  return (
    <View>
      <ThePeerDirectCharge
        {...{
          publicKey: 'PUBLIC_KEY',
          userReference: 'USER_REFERENCE',
          amount: 'AMOUNT_IN_KOBO',
          currency: 'NGN',
          openDirectChargeSDK,
          onSuccess: (response) => {},
          onError: (response) => {},
          onClose: () => setOpenDirectChargeSDK(false),
        }}
      />
      <Pressable onPress={() => setOpenDirectChargeSDK(true)}>
        <Text>Direct Charge</Text>
      </Pressable>
    </View>
  );
};

const checkoutApp = () => {
  const [openCheckoutSDK, setOpenCheckoutSDK] = useState(false);
  return (
    <View>
      <ThePeerDirectCharge
        {...{
          publicKey: 'PUBLIC_KEY',
          amount: 'AMOUNT_IN_KOBO',
          currency: 'NGN',
          openCheckoutSDK,
          onSuccess: (response) => {},
          onError: (response) => {},
          onClose: () => setOpenCheckoutSDK(false),
        }}
      />
      <Pressable onPress={() => setOpenCheckoutSDK(true)}>
        <Text>Checkout</Text>
      </Pressable>
    </View>
  );
};
```

## Configuration Options

- [`publicKey`](#publicKey)
- [`amount`](#amount)
- [`currency`](#currency)
- [`onSuccess`](#onSuccess)
- [`onError`](#onError)
- [`onClose`](#onClose)
- [`meta`](#meta)

## Configuration Options for Send and Direct charge

- [`userReference`](#userReference)

### <a name="publicKey"></a> `publicKey`

**string: Required**
Your public key can be found on your [dashboard](https://dashboard.thepeer.co) settings.

### <a name="userReference"></a> `userReference`

**string: Required**
The user reference returned by Thepeer API when a user has been indexed

### <a name="amount"></a> `amount`

**string|number: Required**
The amount you intend to send in kobo

### <a name="currency"></a> `currency`

**string: Optional**
The currency being used. Defaults to **NGN**

### <a name="onSuccess"></a> `onSuccess`

**(response) => void: Required**
This is called when a transaction is successfully. It returns a response with event type and transaction details.

See the [event details](#thepeerEvent) below.

### <a name="onError"></a> `onError `

**(response) => void: Required**
This is called when a transaction fails. It returns a response with event type

See the [event details](#thepeerEvent) below.

### <a name="onClose"></a> `onClose `

**(response) => void: Required**
This is called when a user clicks on the close button.

### <a name="meta"></a> `meta`

**object: Optional**
This object should contain additional/optional attributes you would like to have on your transaction response

## Configuration Options for Send

### <a name="openSendSDK"></a> `openSendSDK`

**boolean: Required**

This is a prop to display/hide the sdk

## Configuration Options for Direct charge

### <a name="openDirectChargeSDK"></a> `openDirectChargeSDK`

**boolean: Required**
This is a prop to display/hide the sdk

## Configuration Options for Checkout

### <a name="openCheckoutSDK"></a> `openCheckoutSDK`

**boolean: Required**
This is a prop to display/hide the sdk

## Issues

- `Tried to register two views with the same name RNCWebview` - The minimum version of the RN Webview package used for this project is `11.13.0`. Update your version to this version or later to fix this issue.

## Support

If you're having trouble with Thepeer React or your integration, please reach out to us at <support@thepeer.co>. We're more than happy to help you out.

## Thepeer API References

- [Thepeer API Docs](https://docs.thepeer.co)
- [Thepeer Dashboard](https://dashboard.thepeer.co)

## License

[MIT](https://github.com/thepeerstack/thepeer-react-native/blob/master/LICENSE) for more information.
