# Change Log

All notable changes to this project will be documented in this file. Fixes, breaking changes and API changes

### [0.2.5] - 03-08-2022
Fixes
- Fixed broken path to modules issue.

### [0.2.4] - 01-08-2022
Fixes
- react-native-webview now a peerDependency to resolve conflicting with existing versions in your projects. (Apologies for not doing this earlier🥲)

Breaking Changes
- Renamed the SDKs, `ThePeer*` now `Thepeer*`.

Changes
- Abstracted the rendered WebView component
- Stripped out unnecessary validation in useEffect hook. Validating config props at url generation.
- ONLY explicitly handling `*_CLOSE` and `*_SUCCESS` events. Everything other event type is handled by the default case.
