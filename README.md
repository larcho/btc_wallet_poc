Mobile App
=======

## Get Started

```
nvm use
```

```
yarn install
```

```
yarn postinstall
```

## Run Metro for iOS and Android Simulators

```
yarn start
```

## Setup iOS [Instructions in progress]

Make sure latest version of `cocoapods` is installed.
This project includes a `Gemfile` that can be used
to install the appropriate `cocoapods` version as well.

Within the `./ios` folder run:

```
pod install
```

In order to run the iOS project open the Workspace file using Xcode
and hit `play` once loaded.

## Setup Android [Instructions in progress]

Using Android Studio, open the `./android` folder.
This should automatically start to download and install dependencies.
Run in debug mode to load the Android Simulator.
