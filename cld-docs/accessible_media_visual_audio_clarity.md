# Visual and audio clarity



Making content distinguishable means ensuring that users can perceive and differentiate important information regardless of their visual or auditory abilities. This includes providing sufficient color contrast, not relying solely on color to convey information, controlling audio levels, and allowing customization of visual and audio elements.

Users with color blindness, low vision, hearing impairments, or various sensitivities need content that can be perceived clearly in different ways. This section covers Cloudinary's tools for creating high-contrast visuals, assisting color blind users, managing audio levels, customizing text presentation, and adapting content for different viewing modes and environments.

## Visual and audio clarity considerations
{table:class=no-borders overview accessibility-considerations-four-col} Consideration | Cloudinary Image Techniques | Cloudinary Video Techniques | WCAG Reference
---|---|---|---
**Consider users who can't distinguish colors.** If you're using color to convey important information, think about adding patterns, shapes, or text labels so everyone can understand the message. | 🔧 [Assist people with color blind conditions](accessible_media_visual_audio_clarity#assist_people_with_color_blind_conditions) | | [1.4.1](https://www.w3.org/TR/WCAG22/#use-of-color) Use of color
**Think about users who may be startled or distracted by unexpected audio.** If your content plays sound automatically, consider giving users controls to pause, stop, or adjust the volume. | | 🔧 [Adjust audio volume](accessible_media_visual_audio_clarity#adjust_audio_volume)🔧 [Cloudinary Video Player](accessible_media_interactive_controls#cloudinary_video_player) | [1.4.2](https://www.w3.org/TR/WCAG22/#audio-control) Audio control
**Consider users with visual impairments who may have difficulty reading text with poor contrast.** They'll need sufficient color contrast between text and backgrounds to read your content comfortably. | 🔧 [Customizable caption styling](accessible_media_visual_audio_clarity#customizable_caption_styling)   🔧 [Text overlays on images and videos](accessible_media_visual_audio_clarity#text_overlays_on_images_and_videos) 🔧 [Adjust contrast on images and videos](accessible_media_visual_audio_clarity#adjust_contrast_on_images_and_videos)  🔧 [Replacing colors for light/dark themes](accessible_media_visual_audio_clarity#replacing_colors_for_light_dark_themes) | | [1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum) Contrast (minimum)[1.4.6](https://www.w3.org/TR/WCAG22/#contrast-enhanced) Contrast (enhanced)
**Consider whether users can resize, customize, or access your text content.** Actual text is generally more flexible and accessible than text embedded in images. | 🔧 [Customize text overlays in images](accessible_media_visual_audio_clarity#customize_text_overlays_in_images)🔧 [OCR text detection and extraction](accessible_media_visual_audio_clarity#ocr_text_detection_and_extraction) | | [1.4.5](https://www.w3.org/TR/WCAG22/#images-of-text) Images of text
**Think about users who have difficulty separating speech from background noise.** They may need clear audio where the main content stands out from any background sounds. | | 🔧 [Mixing audio tracks](accessible_media_visual_audio_clarity#mixing_audio_tracks) | [1.4.7](https://www.w3.org/TR/WCAG22/#low-or-no-background-audio) Low or no background audio 

## Assist people with color blind conditions

People with color blindness may have difficulty distinguishing between certain colors, particularly red and green. Cloudinary provides tools to help make your media more accessible by using both color and pattern to convey information.

Original

X-Ray Mode

Striped Overlays

### Simulate color blind conditions

You can experience how your images look to people with different color blind conditions. Apply the `e_simulate_colorblind` effect with parameters like `deuteranopia`, `protanopia`, `tritanopia`, or `cone_monochromacy` to preview your content ([see all the options](transformation_reference#e_simulate_colorblind)).

![Simulate color blind conditions on a paint palette](https://res.cloudinary.com/demo/image/upload/e_simulate_colorblind:cone_monochromacy/docs/palette.png "with_image:false")

```nodejs
cloudinary.image("docs/palette.png", {effect: "simulate_colorblind:cone_monochromacy"})
```

```react
new CloudinaryImage("docs/palette.png").effect(
  simulateColorBlind().condition("cone_monochromacy")
);
```

```vue
new CloudinaryImage("docs/palette.png").effect(
  simulateColorBlind().condition("cone_monochromacy")
);
```

```angular
new CloudinaryImage("docs/palette.png").effect(
  simulateColorBlind().condition("cone_monochromacy")
);
```

```js
new CloudinaryImage("docs/palette.png").effect(
  simulateColorBlind().condition("cone_monochromacy")
);
```

```python
CloudinaryImage("docs/palette.png").image(effect="simulate_colorblind:cone_monochromacy")
```

```php
(new ImageTag('docs/palette.png'))
	->effect(Effect::simulateColorBlind()
	->condition(
	SimulateColorBlind::coneMonochromacy())
	);
```

```java
cloudinary.url().transformation(new Transformation().effect("simulate_colorblind:cone_monochromacy")).imageTag("docs/palette.png");
```

```ruby
cl_image_tag("docs/palette.png", effect: "simulate_colorblind:cone_monochromacy")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("simulate_colorblind:cone_monochromacy")).BuildImageTag("docs/palette.png")
```

```dart
cloudinary.image('docs/palette.png').transformation(Transformation()
	.effect(Effect.simulateColorBlind()
	.condition(
	SimulateColorBlind.coneMonochromacy())
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("simulate_colorblind:cone_monochromacy")).generate("docs/palette.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("simulate_colorblind:cone_monochromacy")).generate("docs/palette.png");
```

```flutter
cloudinary.image('docs/palette.png').transformation(Transformation()
	.effect(Effect.simulateColorBlind()
	.condition(
	SimulateColorBlind.coneMonochromacy())
	));
```

```kotlin
cloudinary.image {
	publicId("docs/palette.png")
	 effect(Effect.simulateColorBlind() {
	 condition(
	SimulateColorBlind.coneMonochromacy())
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/palette.png", {effect: "simulate_colorblind:cone_monochromacy"})
```

```react_native
new CloudinaryImage("docs/palette.png").effect(
  simulateColorBlind().condition("cone_monochromacy")
);
```

![Color palette with different simulated colorblind conditions](https://res.cloudinary.com/demo/image/upload/q_auto/docs/palette_simulated.gif "with_code:false, with_url:false, thumb:c_scale,w_350")

### Analyze color accessibility

For a more objective approach to assessing the accessibility of your images, use [Accessibility analysis](accessibility_analysis) (currently available to paid accounts only).

1. Upload your images with the `accessibility_analysis` parameter set to `true`:
      
      ``` multi
      |ruby 
      Cloudinary::Uploader.upload("user_photo.jpg", 
        accessibility_analysis: true)

      |php_2
      $cloudinary->uploadApi()->upload("user_photo.jpg",
        [ "accessibility_analysis" => true ]);

      |nodejs
      cloudinary.v2.uploader
      .upload("user_photo.jpg",
        { accessibility_analysis: true })
      .then(result=>console.log(result)); 

      |python
      cloudinary.uploader.upload("user_photo.jpg",
        accessibility_analysis = 1)

      |java
      cloudinary.uploader().upload("user_photo.jpg", 
        Cloudinary.asMap("accessibility_analysis", true));

      |csharp
      var uploadParams = new ImageUploadParams(){
        File = new FileDescription(@"user_photo.jpg"),
        AccessibilityAnalysis = true};
      var uploadResult = cloudinary.Upload(uploadParams);

      |go
      resp, err := cld.Upload.Upload(ctx, "user_photo.jpg", uploader.UploadParams{
        AccessibilityAnalysis: api.Bool(true)})

      |cli
      cld uploader upload user_photo.jpg accessibility_analysis=true

      |curl
      curl https://api.cloudinary.com/v1_1/demo/image/upload -X POST --data 'file=user_photo.jpg&accessibility_analysis=true&timestamp=173719931&api_key=436464676&signature=a788d68f86a6f868af'
      ```
1. See the accessibility results in the response:
  
      ```json
      "accessibility_analysis": {
        "colorblind_accessibility_analysis": {
          "distinct_edges": 0.93,
          "distinct_colors": 0.33,
          "most_indistinct_pair": [
            "#BCB0AA",
            "#B2BEC9"
          ]
        },
        "colorblind_accessibility_score": 0.63
      },
    ```

For more information see [Accessibility analysis](accessibility_analysis), and for an example of using the results, watch this [video tutorial](color_accessibility_tutorial).

### Apply stripes

Consider a chart that uses red and green colors to convey information. For someone with red-green color blindness, this information would be inaccessible. 

Original image

Simulated deuteranopia

By adding patterns or symbols alongside colors, you can ensure the information is conveyed regardless of color perception.

e_assist_colorblind:20

e_assist_colorblind:20/e_simulate_colorblind

To add the stripes, apply the `assist_colorblind` effect with a stripe strength from 1 to 100, e.g. `e_assist_colorblind:20`:

![Pie chart with stripes added](https://res.cloudinary.com/demo/image/upload/e_assist_colorblind:20/docs/piechart.png "with_image:false")

```nodejs
cloudinary.image("docs/piechart.png", {effect: "assist_colorblind:20"})
```

```react
new CloudinaryImage("docs/piechart.png").effect(
  assistColorBlind().stripesStrength(20)
);
```

```vue
new CloudinaryImage("docs/piechart.png").effect(
  assistColorBlind().stripesStrength(20)
);
```

```angular
new CloudinaryImage("docs/piechart.png").effect(
  assistColorBlind().stripesStrength(20)
);
```

```js
new CloudinaryImage("docs/piechart.png").effect(
  assistColorBlind().stripesStrength(20)
);
```

```python
CloudinaryImage("docs/piechart.png").image(effect="assist_colorblind:20")
```

```php
(new ImageTag('docs/piechart.png'))
	->effect(Effect::assistColorBlind()->stripesStrength(20));
```

```java
cloudinary.url().transformation(new Transformation().effect("assist_colorblind:20")).imageTag("docs/piechart.png");
```

```ruby
cl_image_tag("docs/piechart.png", effect: "assist_colorblind:20")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("assist_colorblind:20")).BuildImageTag("docs/piechart.png")
```

```dart
cloudinary.image('docs/piechart.png').transformation(Transformation()
	.effect(Effect.assistColorBlind().stripesStrength(20)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("assist_colorblind:20")).generate("docs/piechart.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("assist_colorblind:20")).generate("docs/piechart.png");
```

```flutter
cloudinary.image('docs/piechart.png').transformation(Transformation()
	.effect(Effect.assistColorBlind().stripesStrength(20)));
```

```kotlin
cloudinary.image {
	publicId("docs/piechart.png")
	 effect(Effect.assistColorBlind() { stripesStrength(20) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/piechart.png", {effect: "assist_colorblind:20"})
```

```react_native
new CloudinaryImage("docs/piechart.png").effect(
  assistColorBlind().stripesStrength(20)
);
```

### Apply color shifts

For an image where the problematic colors aren't isolated, it can be even harder to distinguish the content of the image.

Original image

Simulated deuteranopia

By shifting the colors, you can ensure the image is clear regardless of color perception.

e_assist_colorblind:xray

Simulated deuteranopiaafter using e_assist_colorblind:xray

To shift the colors, apply the `e_assist_colorblind` effect with the xray effect, e.g. `e_assist_colorblind:xray`:

![Flower and grasshopper with the xray effect applied](https://res.cloudinary.com/demo/image/upload/e_assist_colorblind:xray/docs/redflower.png "with_image:false")

```nodejs
cloudinary.image("docs/redflower.png", {effect: "assist_colorblind:xray"})
```

```react
new CloudinaryImage("docs/redflower.png").effect(assistColorBlind().xray());
```

```vue
new CloudinaryImage("docs/redflower.png").effect(assistColorBlind().xray());
```

```angular
new CloudinaryImage("docs/redflower.png").effect(assistColorBlind().xray());
```

```js
new CloudinaryImage("docs/redflower.png").effect(assistColorBlind().xray());
```

```python
CloudinaryImage("docs/redflower.png").image(effect="assist_colorblind:xray")
```

```php
(new ImageTag('docs/redflower.png'))
	->effect(Effect::assistColorBlind()->xray());
```

```java
cloudinary.url().transformation(new Transformation().effect("assist_colorblind:xray")).imageTag("docs/redflower.png");
```

```ruby
cl_image_tag("docs/redflower.png", effect: "assist_colorblind:xray")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("assist_colorblind:xray")).BuildImageTag("docs/redflower.png")
```

```dart
cloudinary.image('docs/redflower.png').transformation(Transformation()
	.effect(Effect.assistColorBlind().xray()));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("assist_colorblind:xray")).generate("docs/redflower.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("assist_colorblind:xray")).generate("docs/redflower.png");
```

```flutter
cloudinary.image('docs/redflower.png').transformation(Transformation()
	.effect(Effect.assistColorBlind().xray()));
```

```kotlin
cloudinary.image {
	publicId("docs/redflower.png")
	 effect(Effect.assistColorBlind() { xray() }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/redflower.png", {effect: "assist_colorblind:xray"})
```

```react_native
new CloudinaryImage("docs/redflower.png").effect(assistColorBlind().xray());
```

Consider implementing a toggle that adds the assist colorblind effects to your images on demand.

### Interactive color blind accessibility demo

Use the controls below to test different color blind assistance techniques and simulate various color blind conditions. This helps you understand which techniques work best for different types of color vision deficiency.

  Choose Image:
  
    Pie Chart
    Red Flower
  

  Color Blind Assistance:
  
     None
  
  
     Stripes (20)
  
  
     X-ray Mode
  

  Simulate Color Blind Condition:
  
    Normal Vision
    Deuteranopia (red-green, most common)
    Protanopia (red-green)
    Tritanopia (blue-yellow)
    Tritanomaly (blue-yellow, mild)
    Deuteranomaly (red-green, mild)
    Cone Monochromacy (complete)
    Rod Monochromacy (complete)
  

  

  Current Transformation URL:
  <code id="current-url" style="word-break: break-all; font-size: 12px; color: #333;">
    https://res.cloudinary.com/demo/image/upload/w_400/bo_1px_solid_black/docs/piechart.png
  

  Tips for Testing:
  
    Pie Chart: Notice how stripes help distinguish sections that may look similar with color blindness
    Red Flower: X-ray mode shifts colors to make the flower more visible against the green background
    Compare: Try different combinations to see which techniques work best for each condition
  

> **READING**:
>
> * Docs: [Assist people with color blind conditions](effects_and_artistic_enhancements#assist_people_with_color_blind_conditions)

> * Docs: [Accessibility analysis](https://cloudinary.com/documentation/accessibility_analysis) 

> * Blog: [Open your Eyes to Color Accessibility](https://cloudinary.com/blog/open_your_eyes_to_color_accessibility#see_what_you_re_missing)

> * Video tutorial: [Color accessibility in JavaScript](color_accessibility_tutorial)

## Adjust audio volume

For people with hearing impairments or those in different listening environments, providing volume control options ensures your audio and video content is accessible. The WCAG guidelines specify that if audio plays automatically for more than 3 seconds, users must have a mechanism to pause, stop, or control the volume independently.

With Cloudinary, you can implement this mechanism both programmatically and using the Cloudinary Video Player.

### Programmatic volume adjustment

Programmatically adjust the volume directly in your media transformations using the `volume` effect (`e_volume`). This allows you to give control to your users via external controls ([as shown in the demo](#demo_external_volume_controls_using_transformations)).

For example, to reduce the volume to 50% (`e_volume:-50`):

![Video with reduced volume](https://res.cloudinary.com/demo/video/upload/e_volume:-50/docs/grocery-store.mp4 "thumb:c_scale,w_300, muted:false")

```nodejs
cloudinary.video("docs/grocery-store", {effect: "volume:-50"})
```

```react
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(-50));
```

```vue
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(-50));
```

```angular
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(-50));
```

```js
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(-50));
```

```python
CloudinaryVideo("docs/grocery-store").video(effect="volume:-50")
```

```php
(new VideoTag('docs/grocery-store.mp4'))
	->videoEdit(VideoEdit::volume(-50));
```

```java
cloudinary.url().transformation(new Transformation().effect("volume:-50")).videoTag("docs/grocery-store");
```

```ruby
cl_video_tag("docs/grocery-store", effect: "volume:-50")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Effect("volume:-50")).BuildVideoTag("docs/grocery-store")
```

```dart
cloudinary.video('docs/grocery-store.mp4').transformation(Transformation()
	.videoEdit(VideoEdit.volume(-50)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setEffect("volume:-50")).generate("docs/grocery-store.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().effect("volume:-50")).resourceType("video").generate("docs/grocery-store.mp4");
```

```flutter
cloudinary.video('docs/grocery-store.mp4').transformation(Transformation()
	.videoEdit(VideoEdit.volume(-50)));
```

```kotlin
cloudinary.video {
	publicId("docs/grocery-store.mp4")
	 videoEdit(VideoEdit.volume(-50)) 
}.generate()
```

```jquery
$.cloudinary.video("docs/grocery-store", {effect: "volume:-50"})
```

```react_native
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(-50));
```

To increase the volume by 150% (`e_volume:150`):

![Video with increased volume](https://res.cloudinary.com/demo/video/upload/e_volume:150/docs/grocery-store.mp4 "thumb:c_scale,w_300, muted:false")

```nodejs
cloudinary.video("docs/grocery-store", {effect: "volume:150"})
```

```react
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(150));
```

```vue
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(150));
```

```angular
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(150));
```

```js
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(150));
```

```python
CloudinaryVideo("docs/grocery-store").video(effect="volume:150")
```

```php
(new VideoTag('docs/grocery-store.mp4'))
	->videoEdit(VideoEdit::volume(150));
```

```java
cloudinary.url().transformation(new Transformation().effect("volume:150")).videoTag("docs/grocery-store");
```

```ruby
cl_video_tag("docs/grocery-store", effect: "volume:150")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Effect("volume:150")).BuildVideoTag("docs/grocery-store")
```

```dart
cloudinary.video('docs/grocery-store.mp4').transformation(Transformation()
	.videoEdit(VideoEdit.volume(150)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setEffect("volume:150")).generate("docs/grocery-store.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().effect("volume:150")).resourceType("video").generate("docs/grocery-store.mp4");
```

```flutter
cloudinary.video('docs/grocery-store.mp4').transformation(Transformation()
	.videoEdit(VideoEdit.volume(150)));
```

```kotlin
cloudinary.video {
	publicId("docs/grocery-store.mp4")
	 videoEdit(VideoEdit.volume(150)) 
}.generate()
```

```jquery
$.cloudinary.video("docs/grocery-store", {effect: "volume:150"})
```

```react_native
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(150));
```

You can also mute audio completely by setting the volume to `mute`:

![Video with muted audio](https://res.cloudinary.com/demo/video/upload/e_volume:mute/docs/grocery-store.mp4 "thumb:c_scale,w_300, muted:false")

```nodejs
cloudinary.video("docs/grocery-store", {effect: "volume:mute"})
```

```react
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(mute()));
```

```vue
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(mute()));
```

```angular
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(mute()));
```

```js
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(mute()));
```

```python
CloudinaryVideo("docs/grocery-store").video(effect="volume:mute")
```

```php
(new VideoTag('docs/grocery-store.mp4'))
	->videoEdit(VideoEdit::volume(
	Volume::mute()));
```

```java
cloudinary.url().transformation(new Transformation().effect("volume:mute")).videoTag("docs/grocery-store");
```

```ruby
cl_video_tag("docs/grocery-store", effect: "volume:mute")
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation().Effect("volume:mute")).BuildVideoTag("docs/grocery-store")
```

```dart
cloudinary.video('docs/grocery-store.mp4').transformation(Transformation()
	.videoEdit(VideoEdit.volume(
	Volume.mute())));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation().setEffect("volume:mute")).generate("docs/grocery-store.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation().effect("volume:mute")).resourceType("video").generate("docs/grocery-store.mp4");
```

```flutter
cloudinary.video('docs/grocery-store.mp4').transformation(Transformation()
	.videoEdit(VideoEdit.volume(
	Volume.mute())));
```

```kotlin
cloudinary.video {
	publicId("docs/grocery-store.mp4")
	 videoEdit(VideoEdit.volume(
	Volume.mute())) 
}.generate()
```

```jquery
$.cloudinary.video("docs/grocery-store", {effect: "volume:mute"})
```

```react_native
new CloudinaryVideo("docs/grocery-store.mp4").videoEdit(volume(mute()));
```

> **NOTE**: You can also adjust volume programmatically using the [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume) volume property:

```js
const obj = document.createElement("audio");
console.log(obj.volume); // 1
obj.volume = 0.75;

```

### Demo: External volume controls using transformations

For users with restricted movement or motor disabilities, you can create larger, more accessible volume controls outside the video player. These external controls use Cloudinary's volume transformations to deliver videos at different volume levels, making them easier to interact with than the built-in player controls. You can see the delivery URL change when you choose a different volume.

  🔉 Quiet (-50%)
  🔊 Normal (100%)
  📢 Loud (200%)
  🔇 Mute
  Volume: Normal (100%)

  Current transformation URL:
  https://res.cloudinary.com/demo/video/upload/docs/grocery-store.mp4

### Video Player volume controls

The [Cloudinary Video Player](cloudinary_video_player) provides built-in volume controls that users can adjust according to their needs. The player includes both a volume button and a volume slider for precise control.

You can customize the volume controls and set default volume levels in your JavaScript:

```js
const player = cloudinary.videoPlayer('my-player', {
  cloudName: 'demo'
});

player.source('docs/grocery-store', {
  transformation: {
    effect: 'volume:-10' // Set the video volume to play 10% quieter
  }
});

player.volume(0.75); // Set the default volume of the player to 75%
```

> **READING**:
>
> * Docs: [Adjust the audio volume](audio_transformations#adjust_the_audio_volume)

> * Docs: [Cloudinary Video Player](cloudinary_video_player)

> * Docs: [Audio normalization](adaptive_bitrate_streaming#normalizing_audio)

## Customizable caption styling

Captions and subtitles must meet specific contrast requirements to be accessible to people with visual impairments. The WCAG guidelines specify minimum contrast ratios between text and background colors to ensure readability.

### Understanding contrast ratios

A **contrast ratio** measures the difference in brightness between text and its background, expressed as a ratio like 4.5:1 or 7:1. The higher the number, the more contrast there is.

**WCAG Requirements:**

- **Level AA (minimum)**: 4.5:1 contrast ratio for normal text
- **Level AAA (enhanced)**: 7:1 contrast ratio for normal text  
- **Large text** (18pt+ or 14pt+ bold): Lower ratios of 3:1 (AA) or 4.5:1 (AAA)

### How to measure contrast ratios

You can measure contrast ratios using online tools such as [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

**How it works:**

1. **Pick your colors**: Select the text color and background color
2. **Get the ratio**: The tool calculates the mathematical contrast ratio
3. **Check compliance**: See if it meets WCAG AA (4.5:1) or AAA (7:1) standards

**Example measurements:**

* Black text (#000000) on white background (#FFFFFF) = **21:1** (excellent)
* White text (#FFFFFF) on blue background (#0066CC) = **5.74:1** (passes AA)
* Light gray text (#CCCCCC) on white background (#FFFFFF) = **1.61:1** (fails - too low)

### Implementing accessible caption styling

The Cloudinary Video Player allows you to customize caption appearance to meet contrast requirements. The recommended approach is to use the built-in `theme` options which provide predefined backgrounds and styling.

The built-in themes are described in this table:

| Theme | Description | Best for |
|-------|------------|----------|
| `default` | None | High contrast videos only |
| `videojs-default` | High contrast theme with a dark background and white text | General accessibility |
| `yellow-outlined` | Yellow text with a dark outline for visibility | Videos with varied backgrounds |
| `player-colors` | Uses the video player's custom color scheme for the text and background | Brand consistency + accessibility |
| `3d` | Text with a 3D shadow effect | Stylistic preference |

The example at the top of this section uses the `videojs-default` theme. Note that you can also override elements of the theme, for example, by setting the font size.  Here's the Video Player configuration:

```js
const highContrastPlayer = cloudinary.videoPlayer('high-contrast-player', {
  cloudName: 'demo'
});

highContrastPlayer.source('outdoors', {
  textTracks: { 
    captions: { 
      label: 'English (Captions)',
      default: true,
      url: 'https://res.cloudinary.com/demo/raw/upload/outdoors.vtt'
    },
    options: {
      box: {
        x: '10%',
        y: '300%',
        width: '80%',
        height: '20%'
      },
      theme: 'videojs-default',
      fontSize: '16px',
      fontFace: 'Arial, sans-serif'
    }
  }
});
```

To set custom colors for the font and background you can use the `player-colors` theme. This theme uses the colors that you configure when customizing your Video Player. 

```js
  colors: {
    base: '#000000',    // Black background for controls
    text: '#ffffff',    // White text for controls and captions
    accent: '#0066cc'   // Blue accent color - also controls the background for captions
  }
```

```js
const customColorsPlayer = cloudinary.videoPlayer('custom-colors-player', {
  cloudName: 'demo',
  colors: {
    base: '#000000',    // Black background for controls
    text: '#ffffff',    // White text
    accent: '#0066cc'   // Blue accent color - also controls the background for captions
  }
});

customColorsPlayer.source('outdoors', {
  textTracks: { 
    captions: { 
      label: 'English (Captions)',
      default: true,
      url: 'https://res.cloudinary.com/demo/raw/upload/outdoors.vtt'
    },
    options: {
      box: {
        x: '10%',
        y: '300%',
        width: '80%',
        height: '20%'
      },
      theme: 'player-colors',
      fontSize: '16px',
      fontFace: 'Arial, sans-serif'
    }
  }
});
```

> **READING**:
>
> * Docs: [Customizable caption styling](video_player_customization#visual_customization)

## Text overlays on images and videos

Before creating text overlays embedded in images or videos, consider whether the text could instead be placed in your HTML and visually positioned over the media using CSS. HTML text is inherently more accessible because it can be announced by screen readers, restyled by users, translated automatically, and scales with user preferences—all without requiring additional accessibility techniques.

When you do need embedded text overlays in images and videos, it's crucial to ensure sufficient contrast between the text and background for readability. People with visual impairments or those viewing content in bright environments need clear, high-contrast text. Adding background colors or effects to text overlays helps meet WCAG contrast requirements and improves accessibility for everyone.

### Text overlays on images with background

Without proper [contrast](#understanding_contrast_ratios), text overlays can be difficult or impossible to read. Here's how to add accessible text overlays with background colors:

Poor contrast - hard to read

High contrast - accessible

The accessible version uses a semi transparent black background (`b_rgb:00000080`) behind white text (`co_white`) to achieve maximum contrast:

![Image with accessible text overlay](https://res.cloudinary.com/demo/image/upload/l_text:Arial_300:%20Accessible%20Text%20,co_white,b_rgb:00000080/fl_layer_apply,g_center,y_200/docs/white-church-europe-sea.jpg "with_image:false")

```nodejs
cloudinary.image("docs/white-church-europe-sea.jpg", {transformation: [
  {overlay: {font_family: "Arial", font_size: 300, text: "%20Accessible%20Text%20"}, color: "white", background: "#00000080"},
  {flags: "layer_apply", gravity: "center", y: 200}
  ]})
```

```react
new CloudinaryImage("docs/white-church-europe-sea.jpg").overlay(
  source(
    text(" Accessible Text ", new TextStyle("Arial", 300))
      .textColor("white")
      .backgroundColor("#00000080")
  ).position(
    new Position()
      .gravity(compass("center"))
      .offsetY(200)
  )
);
```

```vue
new CloudinaryImage("docs/white-church-europe-sea.jpg").overlay(
  source(
    text(" Accessible Text ", new TextStyle("Arial", 300))
      .textColor("white")
      .backgroundColor("#00000080")
  ).position(
    new Position()
      .gravity(compass("center"))
      .offsetY(200)
  )
);
```

```angular
new CloudinaryImage("docs/white-church-europe-sea.jpg").overlay(
  source(
    text(" Accessible Text ", new TextStyle("Arial", 300))
      .textColor("white")
      .backgroundColor("#00000080")
  ).position(
    new Position()
      .gravity(compass("center"))
      .offsetY(200)
  )
);
```

```js
new CloudinaryImage("docs/white-church-europe-sea.jpg").overlay(
  source(
    text(" Accessible Text ", new TextStyle("Arial", 300))
      .textColor("white")
      .backgroundColor("#00000080")
  ).position(
    new Position()
      .gravity(compass("center"))
      .offsetY(200)
  )
);
```

```python
CloudinaryImage("docs/white-church-europe-sea.jpg").image(transformation=[
  {'overlay': {'font_family': "Arial", 'font_size': 300, 'text': "%20Accessible%20Text%20"}, 'color': "white", 'background': "#00000080"},
  {'flags': "layer_apply", 'gravity': "center", 'y': 200}
  ])
```

```php
(new ImageTag('docs/white-church-europe-sea.jpg'))
	->overlay(Overlay::source(
	Source::text(" Accessible Text ",(new TextStyle("Arial",300)))
	->textColor(Color::WHITE)
	->backgroundColor(Color::rgb("00000080"))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::center()))
->offsetY(200))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(300).text("%20Accessible%20Text%20")).color("white").background("#00000080").chain()
  .flags("layer_apply").gravity("center").y(200)).imageTag("docs/white-church-europe-sea.jpg");
```

```ruby
cl_image_tag("docs/white-church-europe-sea.jpg", transformation: [
  {overlay: {font_family: "Arial", font_size: 300, text: "%20Accessible%20Text%20"}, color: "white", background: "#00000080"},
  {flags: "layer_apply", gravity: "center", y: 200}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new TextLayer().FontFamily("Arial").FontSize(300).Text("%20Accessible%20Text%20")).Color("white").Background("#00000080").Chain()
  .Flags("layer_apply").Gravity("center").Y(200)).BuildImageTag("docs/white-church-europe-sea.jpg")
```

```dart
cloudinary.image('docs/white-church-europe-sea.jpg').transformation(Transformation()
	.addTransformation("l_text:Arial_300: Accessible Text ,co_white,b_rgb:00000080/fl_layer_apply,g_center,y_200"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("text:Arial_300:%20Accessible%20Text%20").setColor("white").setBackground("#00000080").chain()
  .setFlags("layer_apply").setGravity("center").setY(200)).generate("docs/white-church-europe-sea.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(300).text("%20Accessible%20Text%20")).color("white").background("#00000080").chain()
  .flags("layer_apply").gravity("center").y(200)).generate("docs/white-church-europe-sea.jpg");
```

```flutter
cloudinary.image('docs/white-church-europe-sea.jpg').transformation(Transformation()
	.addTransformation("l_text:Arial_300: Accessible Text ,co_white,b_rgb:00000080/fl_layer_apply,g_center,y_200"));
```

```kotlin
cloudinary.image {
	publicId("docs/white-church-europe-sea.jpg")
	 overlay(Overlay.source(
	Source.text(" Accessible Text ",TextStyle("Arial",300)) {
	 textColor(Color.WHITE)
	 backgroundColor(Color.rgb("00000080"))
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.center()))
 offsetY(200) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/white-church-europe-sea.jpg", {transformation: [
  {overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(300).text("%20Accessible%20Text%20"), color: "white", background: "#00000080"},
  {flags: "layer_apply", gravity: "center", y: 200}
  ]})
```

```react_native
new CloudinaryImage("docs/white-church-europe-sea.jpg").overlay(
  source(
    text(" Accessible Text ", new TextStyle("Arial", 300))
      .textColor("white")
      .backgroundColor("#00000080")
  ).position(
    new Position()
      .gravity(compass("center"))
      .offsetY(200)
  )
);
```

### Text overlays on videos with background

Video text overlays face additional challenges as backgrounds change throughout the video. Consistent background colors ensure text remains readable regardless of the video content. This video uses white text (`co_white`) on a semi-transparent blue background (`b_rgb:0000cc90`) to create an overlay that remains visible throughout the video.

> **READING**:
>
> * Docs: [Text overlays on images](layers#text_layer_options)

> * Docs: [Text overlays on videos](video_layers#text_layer_options)

## Adjust contrast on images and videos

Proper contrast, brightness, and saturation adjustments are essential for making images and videos accessible to people with visual impairments, low vision, or those viewing content in challenging lighting conditions. These adjustments can help ensure content remains visible and legible across different viewing environments and for users with varying visual needs.

### Contrast adjustments for images

Contrast adjustments can dramatically improve the readability and accessibility of images. Here are examples showing how different contrast levels affect image visibility:

Low contrast(-80)

Original(0)

High contrast(+80)

Use the [contrast effect](transformation_reference#e_contrast) with a value between -100 and 100:

![Image with high contrast](https://res.cloudinary.com/demo/image/upload/e_contrast:80/docs/apartment-kitchen.jpg "with_image:false")

```nodejs
cloudinary.image("docs/apartment-kitchen.jpg", {effect: "contrast:80"})
```

```react
new CloudinaryImage("docs/apartment-kitchen.jpg").adjust(contrast().level(80));
```

```vue
new CloudinaryImage("docs/apartment-kitchen.jpg").adjust(contrast().level(80));
```

```angular
new CloudinaryImage("docs/apartment-kitchen.jpg").adjust(contrast().level(80));
```

```js
new CloudinaryImage("docs/apartment-kitchen.jpg").adjust(contrast().level(80));
```

```python
CloudinaryImage("docs/apartment-kitchen.jpg").image(effect="contrast:80")
```

```php
(new ImageTag('docs/apartment-kitchen.jpg'))
	->adjust(Adjust::contrast()->level(80));
```

```java
cloudinary.url().transformation(new Transformation().effect("contrast:80")).imageTag("docs/apartment-kitchen.jpg");
```

```ruby
cl_image_tag("docs/apartment-kitchen.jpg", effect: "contrast:80")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("contrast:80")).BuildImageTag("docs/apartment-kitchen.jpg")
```

```dart
cloudinary.image('docs/apartment-kitchen.jpg').transformation(Transformation()
	.adjust(Adjust.contrast().level(80)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("contrast:80")).generate("docs/apartment-kitchen.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("contrast:80")).generate("docs/apartment-kitchen.jpg");
```

```flutter
cloudinary.image('docs/apartment-kitchen.jpg').transformation(Transformation()
	.adjust(Adjust.contrast().level(80)));
```

```kotlin
cloudinary.image {
	publicId("docs/apartment-kitchen.jpg")
	 adjust(Adjust.contrast() { level(80) }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/apartment-kitchen.jpg", {effect: "contrast:80"})
```

```react_native
new CloudinaryImage("docs/apartment-kitchen.jpg").adjust(contrast().level(80));
```

### Interactive contrast, brightness, and saturation demo

In addition to contrast, you can also alter [brightness](transformation_reference#e_brightness) and [saturation](transformation_reference#e_saturation) to help improve image visibility. 

Use the controls below to see how contrast, brightness, and saturation adjustments affect image accessibility in real-time. Notice how the transformation URL changes as you adjust the settings:

  
    Contrast: 0
    
  
  
  
    Brightness: 0
    
  
  
  
    Saturation: 0
    
  
  
  Reset to Original

  Current transformation URL:
  https://res.cloudinary.com/demo/image/upload/c_scale,w_500/f_auto/q_auto/docs/groceryshop.jpg

### Video visual adjustments

Video content can also benefit from contrast, brightness, and saturation adjustments. These are especially important for users with visual impairments who may struggle with low-contrast video content.

This video uses enhanced contrast (`e_contrast:50`), increased brightness (`e_brightness:10`) and saturation (`e_saturation:20`) to improve visibility and accessibility.

![Video with contrast adjustments](https://res.cloudinary.com/demo/video/upload/e_contrast:50/e_brightness:10/e_saturation:20/docs/grocery-store.mp4 "thumb:c_scale,w_500")

```nodejs
cloudinary.video("docs/grocery-store", {transformation: [
  {effect: "contrast:50"},
  {effect: "brightness:10"},
  {effect: "saturation:20"}
  ]})
```

```react
new CloudinaryVideo("docs/grocery-store.mp4")
  .adjust(contrast().level(50))
  .adjust(brightness().level(10))
  .adjust(saturation().level(20));
```

```vue
new CloudinaryVideo("docs/grocery-store.mp4")
  .adjust(contrast().level(50))
  .adjust(brightness().level(10))
  .adjust(saturation().level(20));
```

```angular
new CloudinaryVideo("docs/grocery-store.mp4")
  .adjust(contrast().level(50))
  .adjust(brightness().level(10))
  .adjust(saturation().level(20));
```

```js
new CloudinaryVideo("docs/grocery-store.mp4")
  .adjust(contrast().level(50))
  .adjust(brightness().level(10))
  .adjust(saturation().level(20));
```

```python
CloudinaryVideo("docs/grocery-store").video(transformation=[
  {'effect': "contrast:50"},
  {'effect': "brightness:10"},
  {'effect': "saturation:20"}
  ])
```

```php
(new VideoTag('docs/grocery-store.mp4'))
	->adjust(Adjust::contrast()->level(50))
	->adjust(Adjust::brightness()->level(10))
	->adjust(Adjust::saturation()->level(20));
```

```java
cloudinary.url().transformation(new Transformation()
  .effect("contrast:50").chain()
  .effect("brightness:10").chain()
  .effect("saturation:20")).videoTag("docs/grocery-store");
```

```ruby
cl_video_tag("docs/grocery-store", transformation: [
  {effect: "contrast:50"},
  {effect: "brightness:10"},
  {effect: "saturation:20"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Effect("contrast:50").Chain()
  .Effect("brightness:10").Chain()
  .Effect("saturation:20")).BuildVideoTag("docs/grocery-store")
```

```dart
cloudinary.video('docs/grocery-store.mp4').transformation(Transformation()
	.adjust(Adjust.contrast().level(50))
	.adjust(Adjust.brightness().level(10))
	.adjust(Adjust.saturation().level(20)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setEffect("contrast:50").chain()
  .setEffect("brightness:10").chain()
  .setEffect("saturation:20")).generate("docs/grocery-store.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .effect("contrast:50").chain()
  .effect("brightness:10").chain()
  .effect("saturation:20")).resourceType("video").generate("docs/grocery-store.mp4");
```

```flutter
cloudinary.video('docs/grocery-store.mp4').transformation(Transformation()
	.adjust(Adjust.contrast().level(50))
	.adjust(Adjust.brightness().level(10))
	.adjust(Adjust.saturation().level(20)));
```

```kotlin
cloudinary.video {
	publicId("docs/grocery-store.mp4")
	 adjust(Adjust.contrast() { level(50) })
	 adjust(Adjust.brightness() { level(10) })
	 adjust(Adjust.saturation() { level(20) }) 
}.generate()
```

```jquery
$.cloudinary.video("docs/grocery-store", {transformation: [
  {effect: "contrast:50"},
  {effect: "brightness:10"},
  {effect: "saturation:20"}
  ]})
```

```react_native
new CloudinaryVideo("docs/grocery-store.mp4")
  .adjust(contrast().level(50))
  .adjust(brightness().level(10))
  .adjust(saturation().level(20));
```

> **READING**:
>
> * Docs: [The contrast effect](transformation_reference#e_contrast)

> * Docs: [The brightness effect](transformation_reference#e_brightness) 

> * Docs: [The saturation effect](transformation_reference#e_saturation)

## Replacing colors for light/dark themes

For users who navigate websites with light and dark themes, consistency in visual presentation is crucial for both usability and accessibility. Light and dark themes can significantly impact users with visual sensitivities, light sensitivity conditions, or those who simply prefer one theme over another for better readability. Cloudinary provides powerful tools to automatically adapt image colors to match your application's theme, ensuring a cohesive visual experience.

### Understanding the accessibility need

Different users have varying preferences and needs when it comes to visual themes:

* **Light sensitivity**: Users with photophobia, migraines, or certain medical conditions may find dark themes more comfortable
* **Visual impairments**: Some users with low vision find better contrast in a specific theme
* **Environmental factors**: Dark themes can be easier on the eyes in low-light environments
* **Battery conservation**: On OLED displays, dark themes can help conserve battery life
* **Personal preference**: Users may simply prefer one theme for better readability

### Dynamic color replacement with replace_color

The [replace_color](transformation_reference#e_replace_color) effect allows you to dynamically swap colors in images based on the user's theme preference. This is particularly useful for logos, icons, and graphics that need to maintain brand consistency while adapting to different backgrounds. Try changing the theme at the top right of this page, and you'll see how the different icons look with light and dark themes.

Light theme (original)

Dark theme adapted

This example replaces the predominant color with light gray (`e_replace_color:e6e6e6:50`) with a tolerance of 50 to ensure similar shades are also replaced:

![Logo with color replacement for dark theme](https://res.cloudinary.com/demo/image/upload/e_replace_color:e6e6e6:50/cloudinary_icon.png "with_image:false")

```nodejs
cloudinary.image("cloudinary_icon.png", {effect: "replace_color:e6e6e6:50"})
```

```react
new CloudinaryImage("cloudinary_icon.png").adjust(
  replaceColor("#e6e6e6").tolerance(50)
);
```

```vue
new CloudinaryImage("cloudinary_icon.png").adjust(
  replaceColor("#e6e6e6").tolerance(50)
);
```

```angular
new CloudinaryImage("cloudinary_icon.png").adjust(
  replaceColor("#e6e6e6").tolerance(50)
);
```

```js
new CloudinaryImage("cloudinary_icon.png").adjust(
  replaceColor("#e6e6e6").tolerance(50)
);
```

```python
CloudinaryImage("cloudinary_icon.png").image(effect="replace_color:e6e6e6:50")
```

```php
(new ImageTag('cloudinary_icon.png'))
	->adjust(Adjust::replaceColor(Color::rgb("e6e6e6"))->tolerance(50));
```

```java
cloudinary.url().transformation(new Transformation().effect("replace_color:e6e6e6:50")).imageTag("cloudinary_icon.png");
```

```ruby
cl_image_tag("cloudinary_icon.png", effect: "replace_color:e6e6e6:50")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("replace_color:e6e6e6:50")).BuildImageTag("cloudinary_icon.png")
```

```dart
cloudinary.image('cloudinary_icon.png').transformation(Transformation()
	.adjust(Adjust.replaceColor(Color.rgb("e6e6e6")).tolerance(50)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("replace_color:e6e6e6:50")).generate("cloudinary_icon.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("replace_color:e6e6e6:50")).generate("cloudinary_icon.png");
```

```flutter
cloudinary.image('cloudinary_icon.png').transformation(Transformation()
	.adjust(Adjust.replaceColor(Color.rgb("e6e6e6")).tolerance(50)));
```

```kotlin
cloudinary.image {
	publicId("cloudinary_icon.png")
	 adjust(Adjust.replaceColor(Color.rgb("e6e6e6")) { tolerance(50) }) 
}.generate()
```

```jquery
$.cloudinary.image("cloudinary_icon.png", {effect: "replace_color:e6e6e6:50"})
```

```react_native
new CloudinaryImage("cloudinary_icon.png").adjust(
  replaceColor("#e6e6e6").tolerance(50)
);
```

### Using the theme effect for comprehensive adaptation

For more sophisticated theme adaptation, use the [theme](transformation_reference#e_theme) effect which applies comprehensive color adjustments to the image based on a specific background color.  

For example, change the screen capture to a dark theme with increased sensitivity to photographic elements (`e_theme:color_black:photosensitivity_110`):

![Dark-themed screen shot](https://res.cloudinary.com/demo/image/upload/e_theme:color_black:photosensitivity_110/docs/cloudinary_website.png "with_image:false")

```nodejs
cloudinary.image("docs/cloudinary_website.png", {effect: "theme:color_black:photosensitivity_110"})
```

```react
new CloudinaryImage("docs/cloudinary_website.png").addTransformation(
  "e_theme:color_black:photosensitivity_110"
);
```

```vue
new CloudinaryImage("docs/cloudinary_website.png").addTransformation(
  "e_theme:color_black:photosensitivity_110"
);
```

```angular
new CloudinaryImage("docs/cloudinary_website.png").addTransformation(
  "e_theme:color_black:photosensitivity_110"
);
```

```js
new CloudinaryImage("docs/cloudinary_website.png").addTransformation(
  "e_theme:color_black:photosensitivity_110"
);
```

```python
CloudinaryImage("docs/cloudinary_website.png").image(effect="theme:color_black:photosensitivity_110")
```

```php
(new ImageTag('docs/cloudinary_website.png'))
	->addTransformation("e_theme:color_black:photosensitivity_110");
```

```java
cloudinary.url().transformation(new Transformation().effect("theme:color_black:photosensitivity_110")).imageTag("docs/cloudinary_website.png");
```

```ruby
cl_image_tag("docs/cloudinary_website.png", effect: "theme:color_black:photosensitivity_110")
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation().Effect("theme:color_black:photosensitivity_110")).BuildImageTag("docs/cloudinary_website.png")
```

```dart
cloudinary.image('docs/cloudinary_website.png').transformation(Transformation()
	.addTransformation("e_theme:color_black:photosensitivity_110"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation().setEffect("theme:color_black:photosensitivity_110")).generate("docs/cloudinary_website.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation().effect("theme:color_black:photosensitivity_110")).generate("docs/cloudinary_website.png");
```

```flutter
cloudinary.image('docs/cloudinary_website.png').transformation(Transformation()
	.addTransformation("e_theme:color_black:photosensitivity_110"));
```

```kotlin
cloudinary.image {
	publicId("docs/cloudinary_website.png")
	 addTransformation("e_theme:color_black:photosensitivity_110") 
}.generate()
```

```jquery
$.cloudinary.image("docs/cloudinary_website.png", {effect: "theme:color_black:photosensitivity_110"})
```

```react_native
new CloudinaryImage("docs/cloudinary_website.png").addTransformation(
  "e_theme:color_black:photosensitivity_110"
);
```

Original (Light Theme)

Dark Theme Adaptatione_theme:color_black:photosensitivity_110

The effect applies an algorithm that intelligently adjusts the color of illustrations, such as backgrounds, designs, texts, and logos, while keeping photographic elements in their original colors.

### Interactive theme adaptation demo

Experience how Cloudinary can automatically adapt images for different themes. This demo shows how the same image can be dynamically modified to suit both light and dark themes using the `replace_color` transformation, in addition to smart color replacement using the `theme` effect:

  ☀️ Light Theme
  🌙 Dark Theme
  🎨 Smart Adapt

  Current transformation URL:
  https://res.cloudinary.com/demo/image/upload/c_scale,w_400/f_auto/q_auto/cloudinary_icon.png

> **READING**:
>
> * Video tutorial: [Light and dark mode images in React](https://www.youtube.com/watch?v=tJwDB_islF0)

> * Docs: [Replace color effect](effects_and_artistic_enhancements#replace_color_effect)

> * Docs: [Theme effect](effects_and_artistic_enhancements#theme_effect)

## Customize text overlays in images

Customizable text overlays are essential for accessibility because they allow you to adapt text presentation to meet diverse user needs. Users with visual impairments, dyslexia, or reading difficulties often benefit from specific font styles, sizes, and spacing adjustments. By providing flexibility in text overlay styling, you ensure your content remains accessible across different abilities and preferences.

The WCAG guidelines emphasize that text should be customizable to support users who need larger fonts, different font families, or modified spacing for better readability. Cloudinary's text overlay system provides extensive customization options that help you meet these accessibility requirements while maintaining visual appeal.

![Standard text](https://res.cloudinary.com/demo/image/upload/l_text:Arial_150:Standard%20Text,co_black/fl_layer_apply,g_center/docs/white-texture.jpg "thumb:c_scale,w_300")

```nodejs
cloudinary.image("docs/white-texture.jpg", {transformation: [
  {overlay: {font_family: "Arial", font_size: 150, text: "Standard%20Text"}, color: "black"},
  {flags: "layer_apply", gravity: "center"}
  ]})
```

```react
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text("Standard Text", new TextStyle("Arial", 150)).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```vue
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text("Standard Text", new TextStyle("Arial", 150)).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```angular
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text("Standard Text", new TextStyle("Arial", 150)).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```js
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text("Standard Text", new TextStyle("Arial", 150)).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```python
CloudinaryImage("docs/white-texture.jpg").image(transformation=[
  {'overlay': {'font_family': "Arial", 'font_size': 150, 'text': "Standard%20Text"}, 'color': "black"},
  {'flags': "layer_apply", 'gravity': "center"}
  ])
```

```php
(new ImageTag('docs/white-texture.jpg'))
	->overlay(Overlay::source(
	Source::text("Standard Text",(new TextStyle("Arial",150)))
	->textColor(Color::BLACK)
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::center()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(150).text("Standard%20Text")).color("black").chain()
  .flags("layer_apply").gravity("center")).imageTag("docs/white-texture.jpg");
```

```ruby
cl_image_tag("docs/white-texture.jpg", transformation: [
  {overlay: {font_family: "Arial", font_size: 150, text: "Standard%20Text"}, color: "black"},
  {flags: "layer_apply", gravity: "center"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new TextLayer().FontFamily("Arial").FontSize(150).Text("Standard%20Text")).Color("black").Chain()
  .Flags("layer_apply").Gravity("center")).BuildImageTag("docs/white-texture.jpg")
```

```dart
cloudinary.image('docs/white-texture.jpg').transformation(Transformation()
	.addTransformation("l_text:Arial_150:Standard Text,co_black/fl_layer_apply,g_center"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("text:Arial_150:Standard%20Text").setColor("black").chain()
  .setFlags("layer_apply").setGravity("center")).generate("docs/white-texture.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(150).text("Standard%20Text")).color("black").chain()
  .flags("layer_apply").gravity("center")).generate("docs/white-texture.jpg");
```

```flutter
cloudinary.image('docs/white-texture.jpg').transformation(Transformation()
	.addTransformation("l_text:Arial_150:Standard Text,co_black/fl_layer_apply,g_center"));
```

```kotlin
cloudinary.image {
	publicId("docs/white-texture.jpg")
	 overlay(Overlay.source(
	Source.text("Standard Text",TextStyle("Arial",150)) {
	 textColor(Color.BLACK)
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.center()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/white-texture.jpg", {transformation: [
  {overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(150).text("Standard%20Text"), color: "black"},
  {flags: "layer_apply", gravity: "center"}
  ]})
```

```react_native
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text("Standard Text", new TextStyle("Arial", 150)).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

![Large bold (low vision)](https://res.cloudinary.com/demo/image/upload/l_text:Arial_200_bold:Large%20Bold%20Text,co_black/fl_layer_apply,g_center/docs/white-texture.jpg "thumb:c_scale,w_300")

```nodejs
cloudinary.image("docs/white-texture.jpg", {transformation: [
  {overlay: {font_family: "Arial", font_size: 200, font_weight: "bold", text: "Large%20Bold%20Text"}, color: "black"},
  {flags: "layer_apply", gravity: "center"}
  ]})
```

```react
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text(
      "Large Bold Text",
      new TextStyle("Arial", 200).fontWeight("bold")
    ).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```vue
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text(
      "Large Bold Text",
      new TextStyle("Arial", 200).fontWeight("bold")
    ).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```angular
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text(
      "Large Bold Text",
      new TextStyle("Arial", 200).fontWeight("bold")
    ).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```js
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text(
      "Large Bold Text",
      new TextStyle("Arial", 200).fontWeight("bold")
    ).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```python
CloudinaryImage("docs/white-texture.jpg").image(transformation=[
  {'overlay': {'font_family': "Arial", 'font_size': 200, 'font_weight': "bold", 'text': "Large%20Bold%20Text"}, 'color': "black"},
  {'flags': "layer_apply", 'gravity': "center"}
  ])
```

```php
(new ImageTag('docs/white-texture.jpg'))
	->overlay(Overlay::source(
	Source::text("Large Bold Text",(new TextStyle("Arial",200))
	->fontWeight(
	FontWeight::bold())
	)
	->textColor(Color::BLACK)
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::center()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(200).fontWeight("bold").text("Large%20Bold%20Text")).color("black").chain()
  .flags("layer_apply").gravity("center")).imageTag("docs/white-texture.jpg");
```

```ruby
cl_image_tag("docs/white-texture.jpg", transformation: [
  {overlay: {font_family: "Arial", font_size: 200, font_weight: "bold", text: "Large%20Bold%20Text"}, color: "black"},
  {flags: "layer_apply", gravity: "center"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new TextLayer().FontFamily("Arial").FontSize(200).FontWeight("bold").Text("Large%20Bold%20Text")).Color("black").Chain()
  .Flags("layer_apply").Gravity("center")).BuildImageTag("docs/white-texture.jpg")
```

```dart
cloudinary.image('docs/white-texture.jpg').transformation(Transformation()
	.addTransformation("l_text:Arial_200_bold:Large Bold Text,co_black/fl_layer_apply,g_center"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("text:Arial_200_bold:Large%20Bold%20Text").setColor("black").chain()
  .setFlags("layer_apply").setGravity("center")).generate("docs/white-texture.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(200).fontWeight("bold").text("Large%20Bold%20Text")).color("black").chain()
  .flags("layer_apply").gravity("center")).generate("docs/white-texture.jpg");
```

```flutter
cloudinary.image('docs/white-texture.jpg').transformation(Transformation()
	.addTransformation("l_text:Arial_200_bold:Large Bold Text,co_black/fl_layer_apply,g_center"));
```

```kotlin
cloudinary.image {
	publicId("docs/white-texture.jpg")
	 overlay(Overlay.source(
	Source.text("Large Bold Text",TextStyle("Arial",200) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textColor(Color.BLACK)
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.center()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/white-texture.jpg", {transformation: [
  {overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(200).fontWeight("bold").text("Large%20Bold%20Text"), color: "black"},
  {flags: "layer_apply", gravity: "center"}
  ]})
```

```react_native
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text(
      "Large Bold Text",
      new TextStyle("Arial", 200).fontWeight("bold")
    ).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

![Letter spacing (dyslexia)](https://res.cloudinary.com/demo/image/upload/l_text:Arial_150_letter_spacing_35:Spaced%20Text,co_black/fl_layer_apply,g_center/docs/white-texture.jpg "thumb:c_scale,w_300")

```nodejs
cloudinary.image("docs/white-texture.jpg", {transformation: [
  {overlay: {font_family: "Arial", font_size: 150, letter_spacing: 35, text: "Spaced%20Text"}, color: "black"},
  {flags: "layer_apply", gravity: "center"}
  ]})
```

```react
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text(
      "Spaced Text",
      new TextStyle("Arial", 150).letterSpacing(35)
    ).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```vue
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text(
      "Spaced Text",
      new TextStyle("Arial", 150).letterSpacing(35)
    ).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```angular
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text(
      "Spaced Text",
      new TextStyle("Arial", 150).letterSpacing(35)
    ).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```js
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text(
      "Spaced Text",
      new TextStyle("Arial", 150).letterSpacing(35)
    ).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

```python
CloudinaryImage("docs/white-texture.jpg").image(transformation=[
  {'overlay': {'font_family': "Arial", 'font_size': 150, 'letter_spacing': 35, 'text': "Spaced%20Text"}, 'color': "black"},
  {'flags': "layer_apply", 'gravity': "center"}
  ])
```

```php
(new ImageTag('docs/white-texture.jpg'))
	->overlay(Overlay::source(
	Source::text("Spaced Text",(new TextStyle("Arial",150))->letterSpacing(35))
	->textColor(Color::BLACK)
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::center()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(150).letterSpacing(35).text("Spaced%20Text")).color("black").chain()
  .flags("layer_apply").gravity("center")).imageTag("docs/white-texture.jpg");
```

```ruby
cl_image_tag("docs/white-texture.jpg", transformation: [
  {overlay: {font_family: "Arial", font_size: 150, letter_spacing: 35, text: "Spaced%20Text"}, color: "black"},
  {flags: "layer_apply", gravity: "center"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new TextLayer().FontFamily("Arial").FontSize(150).LetterSpacing(35).Text("Spaced%20Text")).Color("black").Chain()
  .Flags("layer_apply").Gravity("center")).BuildImageTag("docs/white-texture.jpg")
```

```dart
cloudinary.image('docs/white-texture.jpg').transformation(Transformation()
	.addTransformation("l_text:Arial_150_letter_spacing_35:Spaced Text,co_black/fl_layer_apply,g_center"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("text:Arial_150_letter_spacing_35:Spaced%20Text").setColor("black").chain()
  .setFlags("layer_apply").setGravity("center")).generate("docs/white-texture.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(150).letterSpacing(35).text("Spaced%20Text")).color("black").chain()
  .flags("layer_apply").gravity("center")).generate("docs/white-texture.jpg");
```

```flutter
cloudinary.image('docs/white-texture.jpg').transformation(Transformation()
	.addTransformation("l_text:Arial_150_letter_spacing_35:Spaced Text,co_black/fl_layer_apply,g_center"));
```

```kotlin
cloudinary.image {
	publicId("docs/white-texture.jpg")
	 overlay(Overlay.source(
	Source.text("Spaced Text",TextStyle("Arial",150) { letterSpacing(35) }) {
	 textColor(Color.BLACK)
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.center()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/white-texture.jpg", {transformation: [
  {overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(150).letterSpacing(35).text("Spaced%20Text"), color: "black"},
  {flags: "layer_apply", gravity: "center"}
  ]})
```

```react_native
new CloudinaryImage("docs/white-texture.jpg").overlay(
  source(
    text(
      "Spaced Text",
      new TextStyle("Arial", 150).letterSpacing(35)
    ).textColor("black")
  ).position(new Position().gravity(compass("center")))
);
```

### Understanding text overlay parameters

Cloudinary's [text overlay transformation](transformation_reference#l_text) (`l_text`) supports numerous styling parameters that can be combined to create accessible and visually appealing text:

**Core Parameters (Required):**

* **Font**: Any universally available font or custom font (e.g., `Arial`, `Helvetica`, `Times`)
* **Size**: Text size in pixels (e.g., `50`, `100`)

**Styling Parameters (Optional):**

* **Weight**: Font thickness (`normal`, `bold`, `thin`, `light`)
* **Style**: Font appearance (`normal`, `italic`)
* **Decoration**: Text decoration (`normal`, `underline`, `strikethrough`)
* **Alignment**: Text positioning (`left`, `center`, `right`, `justify`)
* **Stroke**: Text outline (`none`, `stroke`)
* **Letter spacing**: Space between characters (`letter_spacing_<value>`)
* **Line spacing**: Space between lines (`line_spacing_<value>`)

**Visual Enhancement Parameters:**

* **Color**: Text color (`co_<color>`)
* **Background**: Background color (`b_<color>`)
* **Border**: Outline styling (`bo_<border>`)

> **TIP**:
>
> :title=Best practices for accessible text overlays

> * **Font Size**: Use sizes of at least 16px for body text, larger for headers. Users with low vision may need even larger text.

> * **Font Choice**: Sans-serif fonts like Arial and Helvetica are often easier to read, especially for users with dyslexia.

> * **Letter Spacing**: Additional spacing between letters can improve readability for users with dyslexia or visual processing difficulties.

> * **Color Contrast**: Ensure sufficient contrast between text and background colors (minimum 4.5:1 ratio for normal text).

> * **Background**: Use solid background colors behind text when overlaying on complex images to ensure readability.

> * **Font Weight**: Bold text can improve readability, but avoid fonts that are too thin (like `light` or `thin` weights) for important content.

### Interactive text overlay customization demo

Use the controls below to experiment with different text styling parameters and see how they affect accessibility and readability. Notice how the transformation URL updates as you adjust the settings:

  
    
    
      Text Content:
              
    
    
          
        Font Family:
        
          Arial
          Helvetica
          Times
          Courier
          Verdana
          Roboto
          Open Sans
        
      
    
          
        Font Size: 50px
        
      
    
    
      Font Weight:
      
        Normal
        Bold
        Thin
        Light
      
    
    
    
      Font Style:
      
        Normal
        Italic
      
    
    
    
      Decoration:
      
        Normal
        Underline
        Strikethrough
      
    
    
    
      Letter Spacing: 0px
      
    
    
    
      Alignment:
      
        Left
        Center
        Right
        Justify
      
    
    
    
      Text Color:
      
        Black
        White
        Red
        Blue
        Green
        Purple
      
    
    
    
      Background:
      
        None
        White
        Black
        Yellow
        Light Blue
        Light Gray
      
    
    
  
  
  Reset to Defaults

  Current transformation URL:
  https://res.cloudinary.com/demo/image/upload/c_fit,l_text:Arial_50:Sample%20Text,co_black,w_1800/fl_layer_apply,g_center/c_scale,w_600/f_auto/q_auto/docs/white-texture.jpg

### Video text overlays

The same customization principles apply to video text overlays. Here's an example of accessible text styling on video content:

![Video with customized text overlay](https://res.cloudinary.com/demo/video/upload/l_text:Arial_60_bold:Accessible%20Video%20Text,co_white,b_rgb:000000cc/fl_layer_apply,g_north,y_50/docs/grocery-store.mp4 "thumb:c_scale,w_500")

```nodejs
cloudinary.video("docs/grocery-store", {transformation: [
  {overlay: {font_family: "Arial", font_size: 60, font_weight: "bold", text: "Accessible%20Video%20Text"}, color: "white", background: "#000000cc"},
  {flags: "layer_apply", gravity: "north", y: 50}
  ]})
```

```react
new CloudinaryVideo("docs/grocery-store.mp4").overlay(
  source(
    text("Accessible Video Text", new TextStyle("Arial", 60).fontWeight("bold"))
      .textColor("white")
      .backgroundColor("#000000cc")
  ).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(50)
  )
);
```

```vue
new CloudinaryVideo("docs/grocery-store.mp4").overlay(
  source(
    text("Accessible Video Text", new TextStyle("Arial", 60).fontWeight("bold"))
      .textColor("white")
      .backgroundColor("#000000cc")
  ).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(50)
  )
);
```

```angular
new CloudinaryVideo("docs/grocery-store.mp4").overlay(
  source(
    text("Accessible Video Text", new TextStyle("Arial", 60).fontWeight("bold"))
      .textColor("white")
      .backgroundColor("#000000cc")
  ).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(50)
  )
);
```

```js
new CloudinaryVideo("docs/grocery-store.mp4").overlay(
  source(
    text("Accessible Video Text", new TextStyle("Arial", 60).fontWeight("bold"))
      .textColor("white")
      .backgroundColor("#000000cc")
  ).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(50)
  )
);
```

```python
CloudinaryVideo("docs/grocery-store").video(transformation=[
  {'overlay': {'font_family': "Arial", 'font_size': 60, 'font_weight': "bold", 'text': "Accessible%20Video%20Text"}, 'color': "white", 'background': "#000000cc"},
  {'flags': "layer_apply", 'gravity': "north", 'y': 50}
  ])
```

```php
(new VideoTag('docs/grocery-store.mp4'))
	->overlay(Overlay::source(
	Source::text("Accessible Video Text",(new TextStyle("Arial",60))
	->fontWeight(
	FontWeight::bold())
	)
	->textColor(Color::WHITE)
	->backgroundColor(Color::rgb("000000cc"))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::north()))
->offsetY(50))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(60).fontWeight("bold").text("Accessible%20Video%20Text")).color("white").background("#000000cc").chain()
  .flags("layer_apply").gravity("north").y(50)).videoTag("docs/grocery-store");
```

```ruby
cl_video_tag("docs/grocery-store", transformation: [
  {overlay: {font_family: "Arial", font_size: 60, font_weight: "bold", text: "Accessible%20Video%20Text"}, color: "white", background: "#000000cc"},
  {flags: "layer_apply", gravity: "north", y: 50}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Overlay(new TextLayer().FontFamily("Arial").FontSize(60).FontWeight("bold").Text("Accessible%20Video%20Text")).Color("white").Background("#000000cc").Chain()
  .Flags("layer_apply").Gravity("north").Y(50)).BuildVideoTag("docs/grocery-store")
```

```dart
cloudinary.video('docs/grocery-store.mp4').transformation(Transformation()
	.addTransformation("l_text:Arial_60_bold:Accessible Video Text,co_white,b_rgb:000000cc/fl_layer_apply,g_north,y_50"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setOverlay("text:Arial_60_bold:Accessible%20Video%20Text").setColor("white").setBackground("#000000cc").chain()
  .setFlags("layer_apply").setGravity("north").setY(50)).generate("docs/grocery-store.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(60).fontWeight("bold").text("Accessible%20Video%20Text")).color("white").background("#000000cc").chain()
  .flags("layer_apply").gravity("north").y(50)).resourceType("video").generate("docs/grocery-store.mp4");
```

```flutter
cloudinary.video('docs/grocery-store.mp4').transformation(Transformation()
	.addTransformation("l_text:Arial_60_bold:Accessible Video Text,co_white,b_rgb:000000cc/fl_layer_apply,g_north,y_50"));
```

```kotlin
cloudinary.video {
	publicId("docs/grocery-store.mp4")
	 overlay(Overlay.source(
	Source.text("Accessible Video Text",TextStyle("Arial",60) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textColor(Color.WHITE)
	 backgroundColor(Color.rgb("000000cc"))
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.north()))
 offsetY(50) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("docs/grocery-store", {transformation: [
  {overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(60).fontWeight("bold").text("Accessible%20Video%20Text"), color: "white", background: "#000000cc"},
  {flags: "layer_apply", gravity: "north", y: 50}
  ]})
```

```react_native
new CloudinaryVideo("docs/grocery-store.mp4").overlay(
  source(
    text("Accessible Video Text", new TextStyle("Arial", 60).fontWeight("bold"))
      .textColor("white")
      .backgroundColor("#000000cc")
  ).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(50)
  )
);
```

This example uses large, bold white text (`Arial_60_bold`) with a semi-transparent black background (`b_rgb:000000cc`) to ensure high contrast and readability across the entire video.

> **READING**:
>
> * Docs: [Text overlays on images](layers#text_layer_options)

> * Docs: [Text overlays on videos](video_layers#text_layer_options)

> * Docs: [Create images from text](create_images_from_text)

## OCR text detection and extraction

For images containing text content, Optical Character Recognition (OCR) technology can extract that text and make it accessible to screen readers and other assistive technologies. This is particularly important for images of documents, signs, menus, handwritten notes, or any visual content where text is embedded within the image rather than provided as separate HTML text.

Cloudinary's [OCR Text Detection and Extraction add-on](ocr_text_detection_and_extraction_addon) can automatically extract text from images during upload, making the content available for accessibility purposes.

Here's an example showing an Italian restaurant menu and the text that Cloudinary's OCR add-on automatically extracted from it:

  Extracted Text Content (Available to Screen Readers):
  
    MENU 1
    INSALATA VERDE
    PIZZA CAPRESE
    18.50
    
    MENU 2
    BRUSCHETTA DELLA CASA
    INSALATA DI POLLO
    19.50
    
    MENU 3
    BRUSCHETTA DELLA CASA
    CANNELLONI DI CARNE
    AL FORNO 21.50
  

  This text content was automatically extracted using OCR and can be read by screen readers, making the Italian menu accessible to users with visual impairments. Note that the OCR detected the language as Italian (locale: "it") and extracted all menu items with their prices.

To extract text from an image:

1. **Subscribe to the OCR add-on**: Enable the [OCR Text Detection and Extraction add-on](ocr_text_detection_and_extraction_addon) in your Cloudinary account.

2. **Extract text during upload**: When uploading images that contain text, use the `ocr` parameter to extract the text content:

    ```multi
    |ruby
    Cloudinary::Uploader.upload("menu-827750_1920.jpg", 
      public_id: "docs/restaurant_menu",
      ocr: "adv_ocr")

    |php_2
    $cloudinary->uploadApi()->upload("menu-827750_1920.jpg", 
      ["public_id" => "docs/restaurant_menu", "ocr" => "adv_ocr"]);

    |python
    cloudinary.uploader.upload("menu-827750_1920.jpg",
      public_id = "docs/restaurant_menu",
      ocr = "adv_ocr")

    |nodejs
    cloudinary.v2.uploader
    .upload("menu-827750_1920.jpg", 
      { public_id: "docs/restaurant_menu", ocr: "adv_ocr" })
    .then(result=>console.log(result)); 

    |java
    cloudinary.uploader().upload("menu-827750_1920.jpg", 
      ObjectUtils.asMap("public_id", "docs/restaurant_menu", "ocr", "adv_ocr"));

    |csharp
    var uploadParams = new ImageUploadParams()
    {
      File = new FileDescription(@"menu-827750_1920.jpg"),
      PublicId = "docs/restaurant_menu",
      Ocr = "adv_ocr"
    };
    var uploadResult = cloudinary.Upload(uploadParams); 

    |cli
    cld uploader upload "menu-827750_1920.jpg" public_id="docs/restaurant_menu" ocr="adv_ocr"
    ```

3. **Use extracted text for accessibility**: The OCR results are returned in the upload response and can be used to provide accessible alternatives:

    ```json
    {
      "public_id": "docs/restaurant_menu",
      "version": 1750668169,
      "info": {
        "ocr": {
          "adv_ocr": {
            "status": "complete",
            "data": [
              {
                "textAnnotations": [
                  {
                    "locale": "it",
                    "description": "MENU 1\nINSALATA VERDE\nPIZZA CAPRESE\n18.50\nMENU 2\nBRUSCHETTA DELLA CASA\nINSALATA DI POLLO\n19.50\nMENU 3\nBRUSCHETTA DELLA CASA\nCANNELLONI DI CARNE\nAL FORNO 21.50"
                  }
                ]
              }
            ]
          }
        }
      }
    }
   ```

    Here's an example in React using the Italian restaurant menu response:

    ```react
    import React from 'react';

    const RestaurantMenuWithOCR = ({ uploadResult }) => {
      // Extract OCR data from the upload response
      const ocrData = uploadResult?.info?.ocr?.adv_ocr;
      const extractedText = ocrData?.data?.[0]?.textAnnotations?.[0]?.description || '';
      
      return (
        <div>
          <img 
            src={uploadResult.secure_url} 
            alt={`${extractedText.replace(/\n/g, ' ')}`}
          />
        </div>
      );
    };

    export default RestaurantMenuWithOCR;
    ```

> **NOTES**:
>
> * You can invoke the OCR Text Detection and Extraction add-on for images already in your product environment using the Admin API [update](admin_api#update_details_of_an_existing_resource) method. 

> * You can retrieve the response at a later date using the Admin API [resource](admin_api#get_details_of_a_single_resource_by_asset_id) method.

> * Consider using [contextual or structured metadata](accessible_media_images#managing_text_alternatives) to store the text.

> **READING**:
>
> * Docs: [OCR text detection and extraction add-on](ocr_text_detection_and_extraction_addon)

## Mixing audio tracks

For users with hearing difficulties or auditory processing disorders, the ability to control the balance between foreground speech and background audio is crucial for accessibility. The WCAG guidelines specify that background sounds should be at least 20 decibels lower than foreground speech content, or users should have the ability to turn off background sounds entirely.

Cloudinary's audio mixing capabilities allow you to layer multiple audio tracks and control their relative volumes, ensuring your content meets accessibility requirements while maintaining audio richness.

To control the volume of different audio tracks, use the [volume](transformation_reference#e_volume) effect in each of the [audio layers](audio_transformations#mixing_audio_tracks).  In this example, the narration is set to a volume of 3dB higher than the original asset (`e_volume:3dB`), and the background wind noise is set to a volume of 18dB lower than the original asset (`e_volume:-18dB`):

![Mixed audio with accessible levels](https://res.cloudinary.com/demo/video/upload/e_volume:3dB/l_audio:docs:wind_norm/e_volume:-18dB/fl_layer_apply/docs/nanotech_norm.mp3 "with_image:false")

```nodejs
cloudinary.url("docs/nanotech_norm.mp3", {resource_type: "video", transformation: [
  {effect: "volume:3dB"},
  {overlay: "audio:docs:wind_norm"},
  {effect: "volume:-18dB"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryVideo("docs/nanotech_norm.mp3")
  .videoEdit(volume("3dB"))
  .overlay(
    source(
      audio("docs/wind_norm").transformation(
        new Transformation().videoEdit(volume("-18dB"))
      )
    )
  );
```

```vue
new CloudinaryVideo("docs/nanotech_norm.mp3")
  .videoEdit(volume("3dB"))
  .overlay(
    source(
      audio("docs/wind_norm").transformation(
        new Transformation().videoEdit(volume("-18dB"))
      )
    )
  );
```

```angular
new CloudinaryVideo("docs/nanotech_norm.mp3")
  .videoEdit(volume("3dB"))
  .overlay(
    source(
      audio("docs/wind_norm").transformation(
        new Transformation().videoEdit(volume("-18dB"))
      )
    )
  );
```

```js
new CloudinaryVideo("docs/nanotech_norm.mp3")
  .videoEdit(volume("3dB"))
  .overlay(
    source(
      audio("docs/wind_norm").transformation(
        new Transformation().videoEdit(volume("-18dB"))
      )
    )
  );
```

```python
cloudinary.utils.cloudinary_url("docs/nanotech_norm.mp3", resource_type="video", transformation=[
  {'effect': "volume:3dB"},
  {'overlay': "audio:docs:wind_norm"},
  {'effect': "volume:-18dB"},
  {'flags': "layer_apply"}
  ])
```

```php
(new VideoTag('docs/nanotech_norm.mp3'))
	->videoEdit(VideoEdit::volume("3dB"))
	->overlay(Overlay::source(
	Source::audio("docs/wind_norm")
	->transformation((new Transformation())
	->videoEdit(VideoEdit::volume("-18dB")))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .effect("volume:3dB").chain()
  .overlay(new Layer().publicId("audio:docs:wind_norm")).chain()
  .effect("volume:-18dB").chain()
  .flags("layer_apply")).resourceType("video").generate("docs/nanotech_norm.mp3")
```

```ruby
cloudinary_url("docs/nanotech_norm.mp3", resource_type: "video", transformation: [
  {effect: "volume:3dB"},
  {overlay: "audio:docs:wind_norm"},
  {effect: "volume:-18dB"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Effect("volume:3dB").Chain()
  .Overlay(new Layer().PublicId("audio:docs:wind_norm")).Chain()
  .Effect("volume:-18dB").Chain()
  .Flags("layer_apply")).BuildUrl("docs/nanotech_norm.mp3")
```

```dart
cloudinary.video('docs/nanotech_norm.mp3').transformation(Transformation()
	.videoEdit(VideoEdit.volume("3dB"))
	.overlay(Overlay.source(
	Source.audio("docs/wind_norm")
	.transformation(new Transformation()
	.videoEdit(VideoEdit.volume("-18dB")))
	)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setEffect("volume:3dB").chain()
  .setOverlay("audio:docs:wind_norm").chain()
  .setEffect("volume:-18dB").chain()
  .setFlags("layer_apply")).generate("docs/nanotech_norm.mp3")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .effect("volume:3dB").chain()
  .overlay(new Layer().publicId("audio:docs:wind_norm")).chain()
  .effect("volume:-18dB").chain()
  .flags("layer_apply")).resourceType("video").generate("docs/nanotech_norm.mp3");
```

```flutter
cloudinary.video('docs/nanotech_norm.mp3').transformation(Transformation()
	.videoEdit(VideoEdit.volume("3dB"))
	.overlay(Overlay.source(
	Source.audio("docs/wind_norm")
	.transformation(new Transformation()
	.videoEdit(VideoEdit.volume("-18dB")))
	)));
```

```kotlin
cloudinary.video {
	publicId("docs/nanotech_norm.mp3")
	 videoEdit(VideoEdit.volume("3dB"))
	 overlay(Overlay.source(
	Source.audio("docs/wind_norm") {
	 transformation(Transformation {
	 videoEdit(VideoEdit.volume("-18dB")) })
	 })) 
}.generate()
```

```jquery
$.cloudinary.url("docs/nanotech_norm.mp3", {resource_type: "video", transformation: [
  {effect: "volume:3dB"},
  {overlay: new cloudinary.Layer().publicId("audio:docs:wind_norm")},
  {effect: "volume:-18dB"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryVideo("docs/nanotech_norm.mp3")
  .videoEdit(volume("3dB"))
  .overlay(
    source(
      audio("docs/wind_norm").transformation(
        new Transformation().videoEdit(volume("-18dB"))
      )
    )
  );
```

### Audio normalization for consistent levels

Before mixing audio tracks, it helps to normalize them to consistent baseline levels. Different audio recordings often have varying baseline volumes, which can make it difficult to achieve predictable dB differences for accessibility compliance.

To normalize your audio files before uploading them to Cloudinary, you can use audio processing tools, such as FFmpeg. 

For example, normalize the audio file nantech.mp3 to -16 LUFS:

```bash
ffmpeg -i nanotech.mp3 -af loudnorm=I=-16:LRA=11:TP=-1.5 nanotech_normalized.mp3
```

This ensures that when you apply `-20dB` or `-25dB` adjustments in Cloudinary, you get the exact dB separation needed for WCAG compliance.

### Interactive audio mixing demo

This demo shows how Cloudinary can mix a primary audio track (nanotechnology narration) with a background audio layer (wind sounds). Use the controls to adjust the volume levels and observe how the dB difference affects accessibility:

Your browser does not support the audio element.

  
    
    
      🎙️ Narration (Foreground)
      Volume: +3 dB
      
      Range: -20 dB to +20 dB
    
    
    
      🌬️ Wind (Background)
      Volume: -18 dB
      
      Range: -50 dB to 0 dB
    
    
  
  
  
    
      dB Difference:
      21 dB
    
    
      ✅ WCAG Compliant: Background is 21 dB lower than foreground (exceeds 20 dB requirement)
    
  
    
  
    📢 WCAG Compliant (25+ dB)
    ⚖️ Balanced Mix
    🔇 No Background
  

  Current transformation URL:
  https://res.cloudinary.com/demo/video/upload/e_volume:3dB/l_audio:docs:wind_norm/e_volume:-18dB/fl_layer_apply/docs/nanotech_norm.mp3

### User-controlled audio track levels

Similar to the above demo, you could provide controls in your application to let the user decide on the levels of each track to meet their needs.  Here's some example React code that you could use:

```react
import React, { useState } from 'react';

const AccessibleAudioPlayer = ({ baseTrack, backgroundTrack }) => {
  const [speechLevel, setSpeechLevel] = useState(0);
  const [backgroundLevel, setBackgroundLevel] = useState(-20);
  const [showBackground, setShowBackground] = useState(true);
  
  // Calculate if mix meets WCAG requirements
  const dbDifference = speechLevel - backgroundLevel;
  const isWCAGCompliant = !showBackground || dbDifference >= 20;
  
  // Generate Cloudinary URL based on settings
  const generateAudioUrl = () => {
    if (!showBackground) {
      return `https://res.cloudinary.com/demo/video/upload/e_volume:${speechLevel}dB/${baseTrack}_norm.mp3`;
    }
    
    const speechVolume = `e_volume:${speechLevel}dB/`;
    const bgVolume = backgroundLevel <= -40 ? 'e_volume:mute/' : `e_volume:${backgroundLevel}dB/`;
    
    // Using normalized audio files for predictable dB separation
    return `https://res.cloudinary.com/demo/video/upload/${speechVolume}l_audio:${backgroundTrack}_norm/${bgVolume}fl_layer_apply/${baseTrack}_norm.mp3`;
  };
  
  return (
    <div className="accessible-audio-player">
      <audio controls src={generateAudioUrl()} />
      
      <div className="audio-controls">
        <div className="control-group">
          <label>Speech Volume: {speechLevel} dB</label>
          <input 
            type="range" 
            min="-10" 
            max="10" 
            value={speechLevel}
            onChange={(e) => setSpeechLevel(parseInt(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={showBackground}
              onChange={(e) => setShowBackground(e.target.checked)}
            />
            Enable Background Audio
          </label>
          
          {showBackground && (
            <>
              <label>Background Volume: {backgroundLevel} dB</label>
              <input 
                type="range" 
                min="-40" 
                max="0" 
                value={backgroundLevel}
                onChange={(e) => setBackgroundLevel(parseInt(e.target.value))}
              />
            </>
          )}
        </div>
        
        <div className={`accessibility-indicator ${isWCAGCompliant ? 'compliant' : 'non-compliant'}`}>
          {isWCAGCompliant ? 
            '✅ WCAG Compliant' : 
            `⚠️ Needs ${20 - dbDifference} dB more separation`
          }
        </div>
      </div>
    </div>
  );
};

export default AccessibleAudioPlayer;
```
> **TIP**:
>
> :title=Best practices for accessible audio mixing

> * **Always provide a no-background option**: Some users need complete silence behind speech

> * **Maintain 20+ dB separation**: When background audio is present, ensure it's at least 20 dB lower

> * **Test with real users**: Audio perception varies greatly between individuals

> * **Consider frequency content**: Low-frequency background sounds are less distracting than mid-range frequencies

> * **Provide visual indicators**: Show users the current dB levels and compliance status

> * **Use consistent levels**: Maintain the same audio balance throughout your content

> **READING**:
>
> * Docs: [Mixing audio tracks](audio_transformations#mixing_audio_tracks)

> * Docs: [Audio transformations](audio_transformations)

 