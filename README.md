# React Native Storybook

Select storybooks inside your editor.

![https://github.com/orta/vscode-react-native-storybooks/raw/master/preview.gif](https://github.com/orta/vscode-react-native-storybooks/raw/master/preview.gif)

## How do I use it?

Install it, ensure that the configuration is right. You should see a new section under the files in the Explorer panel called "Storybook".

🎉

If your react-native server crashes, use the command "Reconnect Storybook to VS Code" to re-connect.

## What does it do?

-   Connect to the React Native storybooks web socket.
-   Single click a story to open it in your simulator.
-   Double click to open story in your editor.

## Configuration

-   `react-native-storybooks.host`: string (default: `"localhost"`)
-   `react-native-storybooks.port`: number (default: `9001`)
-   `react-native-storybooks.storyRegex`: string (default: `"**/*.story.*"`)
-   `react-native-storybooks.storybookFilterRegex`: string (default: `"."`)

You can either change these in your user settings, or per-project you can create a `.vscode/settings.json` file and add them there.

## Filtering

If you work with quite a lot of stories in a project, it can be a bit of a chore to scroll through them all, so you can use setting `react-native-storybooks.storybookFilterRegex` to filter down the shown stories. If you do this on your user settings then only you will see the changes.

## Known Issues

Nothing critical ATM.
