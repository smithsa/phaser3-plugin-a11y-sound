# Phaser3 Plugin Sound A11y
Sound A11y is a phaser plugin that provides common accessibility features for sound, captioning and volume control. 
The plugin creates 3 sound channels for background music, sound effects, and voice, and provides functionality to
control the volume of each channel.

It utilizes accessible DOM elements for an options modal that controls captioning and volume as well as the caption cues.


<img width="100%" alt="demo of sound accessibility plugin" src="http://g.recordit.co/wdGiX64gEw.gif"/>

## Prerequisites
* [Yarn](https://yarnpkg.com/)
* [Node](https://nodejs.org/en/)

## Installation
Clone the repository from git and run `yarn install` and you're set to go.

## Demo / Development
The plugin is bundled with a demo which is used for testing during development. Build your demo to match your needs and test your plugin on the fly while developing.
Run `yarn demo` or `yarn dev` in your terminal and direct your browser to http://localhost:3000.

## Build plugin
Build the plugin including minified version. Targets the dist folder.
`npm run build`

## Usage

Usage can be seen in the demo folder.

### Plugin Installation
1a. Install the package by running the following in your terminal
`yarn add phaser3-plugin-sound-a11y`

1b. Import the SoundA11yPlugin plugin
   `import SoundA11yPlugin from "phaser3-plugin-sound-a11y"`

2. Ensure your game config has the `parent` and `dom` fields set.
[See Phaser API docs for game config for more information.](https://newdocs.phaser.io/docs/3.52.0/Phaser.Types.Core.GameConfig)

```
    parent: "game-container",
    dom: {
      createContainer: true
    },
```

3. Install the plugin by adding the following in your game config
```
  plugins: {
      scene: [
        { key: 'SoundA11yPlugin',
          plugin: SoundA11yPlugin,
          start: true,
          mapping: 'SoundA11yPlugin'
        }
      ]
  }
```

You now have access to the plugin in all scenes.

4. Initialize the plugin in the scene's create
```javascript
this.SoundA11yPlugin.init({
  captions: captions,
  modalX: 500,
  modalY: 100,
  primaryColor: "green",
  captionsOn: true,
  volume: {
    music: 1,
    sfx: 1,
    voice: 1
  }
});
```
| name | type | required | default | description  |
|---|---|---|---|---|
| captions | object | false |{}| an object with sound names and markers as keys and the values are the caption cues  |
| captionsOn | boolean | false |false| boolean that indicates if captions are on  |
| modalX | integer | false |500| y position of the options modal |
| modalY | integer | false |100| x position of the options modal  |
| primaryColor | string | false |"#0d68c2"| primary accent color for the options modal, takes hex or web safe color  |
| volume | object | false | { music: .2, voice: 1, sfx: .5} | volume setting for each sound channel |

### Plugin Usage

#### Adding a Sounds to a Channel
```javascript
preload () {
  this.load.audio('title', '[your path to tile audio]');
}

create() {
  this.titleSoundObject = this.SoundA11yPlugin.add('voice', 'title');
}
```

#### Playing a sound
```javascript
preload () {
  this.load.audio('title', '[your path to tile audio]');
}

create() {
  this.titleSoundObject = this.SoundA11yPlugin.add('voice', 'title');
  this.SoundA11yPlugin.play(titleSoundObject);
}
```

#### Adding Sounds with markers to a Channel
```javascript
preload () {
  this.load.audio('title', '[your path to tile audio]');
}

create() {
  this.introSoundObject = this.SoundA11yPlugin.add('voice', 'intro');
  this.introSoundObject.addMarker({name: "intro_start", start: 0, duration: 3});
  this.introSoundObject.addMarker({name: "intro_beakers_exploded", start: 3, duration: 2});
  this.introSoundObject.addMarker({name: "intro_slime_everywhere", start: 5, duration: 2.9});
  this.introSoundObject.addMarker({name: "intro_slime_expanding", start: 7.9, duration: 5.3});
  this.introSoundObject.addMarker({name: "intro_end", start: 13.2, duration: 2});
  this.SoundA11yPlugin.play(introSoundObject);
}
```

#### Playing a sound with a marker
```javascript
preload () {
  this.load.audio('title', '[your path to tile audio]');
}

create() {
  this.introSoundObject = this.SoundA11yPlugin.add('voice', 'intro');
  this.introSoundObject.addMarker({name: "intro_start", start: 0, duration: 3});
  this.introSoundObject.addMarker({name: "intro_beakers_exploded", start: 3, duration: 2});
  this.introSoundObject.addMarker({name: "intro_slime_everywhere", start: 5, duration: 2.9});
  this.introSoundObject.addMarker({name: "intro_slime_expanding", start: 7.9, duration: 5.3});
  this.introSoundObject.addMarker({name: "intro_end", start: 13.2, duration: 2});
}
```

#### Stopping All Sound Channels
```javascript
this.SoundA11yPlugin.stop();
```

#### Stopping Music Sound Channels
```javascript
this.SoundA11yPlugin.stop("music");
```
#### Stopping SFX Sound Channels
```javascript
this.SoundA11yPlugin.stop("sound");
```

#### Stopping Voice Sound Channels
```javascript
this.SoundA11yPlugin.stop("voice");
```

### Plugin Methods
| method | parameter type| parameter description |  returns | description |
|---|---|---|---|---|
| init | config\<object> | [see example, #4](#plugin-installation) | undefined | initializes the plugin with config settings|
| add | channel\<string> , key\<string>, [phaserSoundConfig\<object>](https://photonstorm.github.io/phaser3-docs/Phaser.Types.Sound.html#.SoundConfig) | the sound channel, Phaser sound key, Phaser sound object config| [Phaser Sound Object](https://photonstorm.github.io/phaser3-docs/Phaser.Sound.BaseSound.html) | stops specified sounds channel|
| play | [soundObject\<object>](https://photonstorm.github.io/phaser3-docs/Phaser.Sound.BaseSound.html) | [Phaser sound object](https://photonstorm.github.io/phaser3-docs/Phaser.Sound.BaseSound.html) | promise | plays phaser sound audio|
| stop | channel\<string> | valid options are "sound", "music", "voice" | undefined | stops specified sounds channel|


## Captioning

### File structure example
The keys are the sound name given to a Phaser sound object or it can be a marker on a Phaser sound object
```json
{
  "title": "Toxic Slime Sweep",
  "intro_start": "Yikes, there was an accident in Laboratory X",
  "intro_beakers_exploded": "all the beakers exploded",
  "intro_slime_everywhere": "and spilled toxic slime everywhere",
  "intro_slime_expanding": "the slime is expanding quickly, solve the multiplication problems to clean up the slime",
  "intro_end": "and save the laboratory!"
}
```

### Importing captions
It's recommended to store your captions in a json file and then import them.

```javascript
import captions from './captions.json';
this.SoundA11yPlugin.init({
  captions: captions,
});
```

## Built With
* [Phaser 3](https://phaser.io/phaser3)
* [Javascript](https://www.javascript.com/)
* [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
* [Webpack](https://webpack.js.org/)
* [Yarn](https://yarnpkg.com/)


## Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

* [Plugin Starter Kit for Phaser](https://github.com/nkholski/phaser-plugin-starter)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT © [Sade Smith](https://sadesmith.com)
