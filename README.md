# Thepeer React Native SDK

Thepeer SDK is a quick and secure way to send money across any business. The SDK handles connecting other businesses to your app.

<img src='https://user-images.githubusercontent.com/23347440/130235552-28306fee-38ad-4879-8a75-650ebacdff07.png' alt='screenshot of Send SDK' width='250px' />
<img src='https://user-images.githubusercontent.com/23347440/130235545-49ed32ee-31fe-4c63-8967-117b96bf52f3.png' alt='screenshot of Direct Charge SDK' width='250px' />

## Installation

```sh
npm install thepeer-react-native
```

Also install `react-native-webview` because it's a dependency for this package. Here's a [link](https://github.com/react-native-webview/react-native-webview) to their docs.

## Usage

```js
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { ThePeerSend, ThePeerDirectCharge } from 'thepeer-react-native';
// ...

const sendMoney = () => {
  const [openSendSDK, setOpenSendSDK] = useState(false);
  return (
    <View>
      <ThePeerSend
        {...{
          publicKey: 'PUBLIC_KEY',
          userReference: 'USER_REFERENCE',
          receiptUrl: 'CALLBACK_URL',
          amount: 'AMOUNT_IN_KOBO',
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

const directCharge = () => {
  const [openDirectChargeSDK, setOpenDirectChargeSDK] = useState(false);
  return (
    <View>
      <ThePeerDirectCharge
        {...{
          publicKey: 'PUBLIC_KEY',
          userReference: 'USER_REFERENCE',
          amount: 'AMOUNT_IN_KOBO',
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
```

## Configuration Options

- [`publicKey`](#publicKey)
- [`userReference`](#userReference)
- [`amount`](#amount)
- [`onSuccess`](#onSuccess)
- [`onError`](#onError)
- [`onClose`](#onClose)
- [`meta`](#meta)

### <a name="publicKey"></a> `publicKey`

**string: Required**
Your public key can be found on your [dashboard](https://dashboard.thepeer.co) settings.

### <a name="userReference"></a> `userReference`

**string: Required**
The user reference returned by Thepeer API when a user has been indexed

### <a name="amount"></a> `amount`

**string|number: Required**
The amount you intend to send in kobo

### <a name="onSuccess"></a> `onSuccess`

**(response) => { Void }: Required**
This is called when a transaction is successfully. It returns a response with event type and transaction details.

See the [event details](#thepeerEvent) below.

### <a name="onError"></a> `onError `

**(response) => { Void }: Required**
This is called when a transaction fails. It returns a response with event type

See the [event details](#thepeerEvent) below.

### <a name="onClose"></a> `onClose `

**() => { Void }: Required**
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
**boolean: Required**

### <a name="thepeerEvent"></a> Events Details (optional)

#### <a name="event"></a> `event: String`

Event names correspond to the type of event that occurred. Possible options are in the table below.

| Event Name                                                           | Description                                  |
| -------------------------------------------------------------------- | -------------------------------------------- |
| send.success or direct_debit.success                                 | successful transaction.                      |
| send.insufficient_funds or direct_debit.insufficient_funds           | business has no money to process transaction |
| send.user_insufficient_funds or direct_debit.user_insufficient_funds | user has no money to process transaction     |
| send.server_error or direct_debit.server_error                       | something went wrong                         |

#### <a name="transactionObject"></a> `transaction: JSON`

The transaction JSON returned from the success events for.

```ts
{
  "id": "transaction-identifier",
  "remark": "medicine",
  "amount": 50000,
  "type": "peer",
  "status": "success",
  "user": {
      "name": "Tim Cook",
      "identifier": "tim",
      "identifier_type": "username",
      "email": "tim@apple.com",
      "reference": "one-more-thing"
  },
  "mode": "debit",
  "reference": "transaction-reference",
  "peer": {
      "user": {
          "name": "Kamsi Oleka",
          "identifier": "ezemmuo",
          "identifier_type": "username",
          "email": "eze@mmuo.co",
          "reference": "seeing-is-believing"
      },
      "business": {
          "id": "knowledge-and-power",
          "name": "Apple",
          "email": "thepeer@apple.com",
          "logo": null,
          "identifier_type": "username"
      }
  },
  "meta": {
      "city": "Cupertino",
      "state": "california"
  },
  "created_at": "2021-04-12T19:52:22.000000Z",
  "updated_at": "2021-04-12T19:52:22.000000Z"
}
```

## Issues

- `Tried to register two views with the same name RNCWebview` - The minimum version of the RN Webview package used for this project is `11.13.0`. Update your version to this version or later to fix this issue.

## Support

If you're having trouble with Thepeer React Native SDK or your integration, please reach out to us at <support@thepeer.co> or come chat with us on Slack. We're more than happy to help you out.

## License

[MIT](https://github.com/thepeerstack/react-native-sdk/blob/master/LICENSE) for more information.
