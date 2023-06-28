# Thepeer React Native SDK

Thepeer is a quick and secure way to send money across any business. The SDK handles connecting other businesses to your app.

<img src='https://github.com/thepeerstack/thepeer-react-native/assets/23347440/effe4e48-3841-44cb-a88b-43bc745f594b' alt='screenshot of Send SDK' width='250px' />
<img src='https://github.com/thepeerstack/thepeer-react-native/assets/23347440/bb54e005-590b-43d7-bae5-7f51af4ac746' alt='screenshot of Direct Charge SDK' width='250px' />

## Installation

```sh
npm install thepeer-react-native
```

or

```sh
yarn add thepeer-react-native
```

You need to install `react-native-webview` if you don't have it installed. It's a dependency for this package. Here's a <a href='https://github.com/react-native-webview/react-native-webview' rel='noopener noreferrer' target='_blank'>link</a> to their docs.

## Usage

```js
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import {
  ThepeerSend,
  ThepeerDirectCharge,
  ThepeerCheckout,
} from 'thepeer-react-native';
// ...

const sendApp = () => {
  const [openSendSDK, setOpenSendSDK] = useState(false);
  const closeSendSDK = () => setOpenSendSDK(false);

  return (
    <View>
      <ThepeerSend
        {...{
          publicKey: 'PUBLIC_KEY',
          userReference: 'USER_REFERENCE',
          amount: 'AMOUNT_IN_KOBO',
          currency: 'NGN',
          openSendSDK,
          onSuccess: (response) => {
            console.log('response', response);
            closeSendSDK();
          },
          onError: (response) => {
            console.log('response', response);
            closeSendSDK();
          },
          onClose: closeSendSDK,
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
  const closeDirectChargeSDK = () => setOpenDirectChargeSDK(false);

  return (
    <View>
      <ThepeerDirectCharge
        {...{
          publicKey: 'PUBLIC_KEY',
          userReference: 'USER_REFERENCE',
          amount: 'AMOUNT_IN_KOBO',
          currency: 'NGN',
          openDirectChargeSDK,
          onSuccess: (response) => {
            console.log('response', response);
            closeDirectChargeSDK();
          },
          onError: (response) => {
            console.log('response', response);
            closeDirectChargeSDK();
          },
          onClose: closeDirectChargeSDK,
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
  const closeCheckoutSDK = () => setOpenCheckoutSDK(false);

  return (
    <View>
      <ThepeerCheckout
        {...{
          publicKey: 'PUBLIC_KEY',
          amount: 'AMOUNT_IN_KOBO',
          currency: 'NGN',
          openCheckoutSDK,
          onSuccess: (response) => {
            console.log('response', response);
            closeCheckoutSDK();
          },
          onError: (response) => {
            console.log('response', response);
            closeCheckoutSDK();
          },
          onClose: closeCheckoutSDK,
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
Your public key can be found on your <a href='https://dashboard.thepeer.co/settings/api-keys-and-webhooks' rel='noopener noreferrer' target='_blank'>dashboard settings</a>.

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
This is called when a transaction is successfully. It returns a response with event type and transaction object.


See the <a href='https://docs.thepeer.co/process-authorization-requests#supported-values' rel='noopener noreferrer' target='_blank'>event types</a>.

See the <a href='https://docs.thepeer.co/transaction/transaction-object' rel='noopener noreferrer' target='_blank'>transaction object</a>.

### <a name="onError"></a> `onError`

**(response) => void: Required**
This is called when a transaction fails. It returns a response with event type

See the <a href='https://docs.thepeer.co/process-authorization-requests#supported-values' rel='noopener noreferrer' target='_blank'>event types</a>.

### <a name="onClose"></a> `onClose`

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


### <a name="email"></a> `email`

**string: Required**
The user's email address.

## Common Issues
#### Tried to register two views with the same name RNCWebview
- The minimum version of the RN Webview package used for this project is `11.13.0`. Update your version to this version or later to fix this issue.
- To know all the versions of react-native-webview within your project, run `npm ls react-native-webview`, and upgrade to the latest version.

## Support

If you're having trouble with Thepeer React or your integration, please reach out to us at <support@thepeer.co>. We're more than happy to help you out.

## Thepeer's API References

- <a href='https://docs.thepeer.co' rel='noopener noreferrer' target='_blank'>Thepeer's API Docs</a>
- <a href='https://dashboard.thepeer.co' rel='noopener noreferrer' target='_blank'>Thepeer's Dashboard</a>


## License

[MIT](https://github.com/thepeerstack/thepeer-react-native/blob/master/LICENSE) for more information.
