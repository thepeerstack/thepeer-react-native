# Change Log

All notable changes to this project will be documented in this file. Fixes, breaking changes and API changes


### [0.2.6] - 03-03-2023
Changes
- Implement a navigation handler for external links: Links in webview would now open on the device's default browser and not on the same WebView.
- Implemented a full screen modal for all SDKs
- Better typing for each SDK's props
- Created a function to handle all expected events
- Only validating SDK props, pushing the rest onto to source to handle
- Updated assets for ErrorFallback
- Update primary colour
- Version bump


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
