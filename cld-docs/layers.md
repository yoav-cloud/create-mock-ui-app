# Placing layers on images

Cloudinary allows you to dynamically add layers to specific locations within your images, where the new layers are added over the base image as overlays, and can also be easily transformed to suit your needs. There are multiple options for adding a new layer to a base image, either an image uploaded to Cloudinary, a remote image, or a text string. 

Image layers can also be added as [underlays](#image_underlays) instead, and there are [special layer applications](#special_layer_applications) for using layers in combination with other Cloudinary transformations.

Here are examples of some popular use cases that you can accomplish using layers (combined with other transformations). Click each image to see the URL parameters applied in each case:

Brand or watermark your images

Hide all detected faces

Add personalized text

Displace imageson products

> **NOTE**: This page describes Cloudinary transformations that apply layers to a specified base image. This differs from delivering images where the [original source file has layers](paged_and_layered_media) that you might reference in a transformation.

## Layer transformation syntax

In its most simple form, adding a layer over the base image takes following URL syntax:

```
l_<public id of overlay>/fl_layer_apply
```

The `layer` parameter is in its own URL component and starts the overlay definition (similar to an open bracket). The `layer_apply` flag is in a separate component that closes the definition (similar to a closing bracket) and instructs Cloudinary to place it.

> **NOTE**: Replace any forward slashes in the public ID of the overlay with colons.

You can enhance your layer both by controlling where and how it is [placed](#layer_placement) on the base image using **gravity**, **offset** and other placement qualifiers, and by applying [transformations](#layer_transformations) to the layered asset, using the following general URL syntax.

```
l_<public_id of layer>/<optional layer transformations>/fl_layer_apply,<optional placement qualifiers>
```

### Authenticated or private layers

You can add image overlays that are set to `authenticated` or `private` by modifying the syntax:

* For private layers: `l_private:<public_id of layer>`
* For authenticated layers: `l_authenticated:<public_id of layer>`

> **INFO**: You can only add image overlays that are set to `authenticated` or `private` if you also sign the whole URL (no separate signature is required for the overlay part). See the [Media access control](control_access_to_media) documentation for more details on delivering private and authenticated assets.

### Image overlays

The default overlay type is an image. For example, adding an overlay of a logo to a base image (`l_docs:logo-semi-opaque/fl_layer_apply`):

![Image with overlay](https://res.cloudinary.com/demo/image/upload/l_docs:logo-semi-opaque/fl_layer_apply/docs/suit_man_forest "thumb: w_500")

```nodejs
cloudinary.image("docs/suit_man_forest", {transformation: [
  {overlay: "docs:logo-semi-opaque"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryImage("docs/suit_man_forest").overlay(
  source(image("docs/logo-semi-opaque"))
);
```

```vue
new CloudinaryImage("docs/suit_man_forest").overlay(
  source(image("docs/logo-semi-opaque"))
);
```

```angular
new CloudinaryImage("docs/suit_man_forest").overlay(
  source(image("docs/logo-semi-opaque"))
);
```

```js
new CloudinaryImage("docs/suit_man_forest").overlay(
  source(image("docs/logo-semi-opaque"))
);
```

```python
CloudinaryImage("docs/suit_man_forest").image(transformation=[
  {'overlay': "docs:logo-semi-opaque"},
  {'flags': "layer_apply"}
  ])
```

```php
(new ImageTag('docs/suit_man_forest'))
	->overlay(Overlay::source(
	Source::image("docs/logo-semi-opaque")));
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:logo-semi-opaque")).chain()
  .flags("layer_apply")).imageTag("docs/suit_man_forest");
```

```ruby
cl_image_tag("docs/suit_man_forest", transformation: [
  {overlay: "docs:logo-semi-opaque"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("docs:logo-semi-opaque")).Chain()
  .Flags("layer_apply")).BuildImageTag("docs/suit_man_forest")
```

```dart
cloudinary.image('docs/suit_man_forest').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/logo-semi-opaque"))));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("docs:logo-semi-opaque").chain()
  .setFlags("layer_apply")).generate("docs/suit_man_forest")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:logo-semi-opaque")).chain()
  .flags("layer_apply")).generate("docs/suit_man_forest");
```

```flutter
cloudinary.image('docs/suit_man_forest').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/logo-semi-opaque"))));
```

```kotlin
cloudinary.image {
	publicId("docs/suit_man_forest")
	 overlay(Overlay.source(
	Source.image("docs/logo-semi-opaque"))) 
}.generate()
```

```jquery
$.cloudinary.image("docs/suit_man_forest", {transformation: [
  {overlay: new cloudinary.Layer().publicId("docs:logo-semi-opaque")},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryImage("docs/suit_man_forest").overlay(
  source(image("docs/logo-semi-opaque"))
);
```

![Video with image overlay](https://res.cloudinary.com/demo/video/upload/l_docs:logo-semi-opaque/fl_layer_apply/glide-over-coastal-beach.mp4 "thumb: w_600")

```nodejs
cloudinary.video("glide-over-coastal-beach", {transformation: [
  {overlay: "docs:logo-semi-opaque"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryVideo("glide-over-coastal-beach.mp4").overlay(
  source(image("docs/logo-semi-opaque"))
);
```

```vue
new CloudinaryVideo("glide-over-coastal-beach.mp4").overlay(
  source(image("docs/logo-semi-opaque"))
);
```

```angular
new CloudinaryVideo("glide-over-coastal-beach.mp4").overlay(
  source(image("docs/logo-semi-opaque"))
);
```

```js
new CloudinaryVideo("glide-over-coastal-beach.mp4").overlay(
  source(image("docs/logo-semi-opaque"))
);
```

```python
CloudinaryVideo("glide-over-coastal-beach").video(transformation=[
  {'overlay': "docs:logo-semi-opaque"},
  {'flags': "layer_apply"}
  ])
```

```php
(new VideoTag('glide-over-coastal-beach.mp4'))
	->overlay(Overlay::source(
	Source::image("docs/logo-semi-opaque")));
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:logo-semi-opaque")).chain()
  .flags("layer_apply")).videoTag("glide-over-coastal-beach");
```

```ruby
cl_video_tag("glide-over-coastal-beach", transformation: [
  {overlay: "docs:logo-semi-opaque"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("docs:logo-semi-opaque")).Chain()
  .Flags("layer_apply")).BuildVideoTag("glide-over-coastal-beach")
```

```dart
cloudinary.video('glide-over-coastal-beach.mp4').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/logo-semi-opaque"))));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setOverlay("docs:logo-semi-opaque").chain()
  .setFlags("layer_apply")).generate("glide-over-coastal-beach.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:logo-semi-opaque")).chain()
  .flags("layer_apply")).resourceType("video").generate("glide-over-coastal-beach.mp4");
```

```flutter
cloudinary.video('glide-over-coastal-beach.mp4').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/logo-semi-opaque"))));
```

```kotlin
cloudinary.video {
	publicId("glide-over-coastal-beach.mp4")
	 overlay(Overlay.source(
	Source.image("docs/logo-semi-opaque"))) 
}.generate()
```

```jquery
$.cloudinary.video("glide-over-coastal-beach", {transformation: [
  {overlay: new cloudinary.Layer().publicId("docs:logo-semi-opaque")},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryVideo("glide-over-coastal-beach.mp4").overlay(
  source(image("docs/logo-semi-opaque"))
);
```

> **INFO**: If the public ID of an image includes slashes (e.g., the public ID of an image is `animals/dog`), replace the slashes with colons when using the image as an overlay (e.g., the public ID of the overlay image becomes `animals:dog` when used as an overlay).

**See full syntax**: [l_\<image id\>](transformation_reference#l_image_id) in the _Transformation Reference_.

**Try it out**: [Layers](https://console.cloudinary.com/app/image/home/layers?media=image&collection=image&sample=me%2Flayers-fashion-1.jpeg&variant=banner&imageCompass=north_east&textCompass=center&text=NEW+COLLECTION).

### Remote image overlays

Use a remote image (an image not stored in your Cloudinary product environment) as an overlay by adding the `fetch` (or `url` for some SDKs) property of the `layer` parameter ( `l_fetch:` in URLs) and the base64 encoded URL of the remote image. The general URL syntax for adding a remote image as an overlay takes the following form:

```
l_fetch:<URL of overlay>/<optional transformations>/fl_layer_apply,<optional placement qualifiers>
```

For example, adding an overlay of the remote image `https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png` to the base image.

![Image with remote overlay](https://res.cloudinary.com/demo/image/upload/l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvbG9nb3MvY2xvdWRpbmFyeV9pY29uX3doaXRlLnBuZw/fl_layer_apply/docs/office_desk "thumb: w_500")

```nodejs
cloudinary.image("docs/office_desk", {transformation: [
  {overlay: {url: "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"}},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryImage("docs/office_desk").overlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"
    )
  )
);
```

```vue
new CloudinaryImage("docs/office_desk").overlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"
    )
  )
);
```

```angular
new CloudinaryImage("docs/office_desk").overlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"
    )
  )
);
```

```js
new CloudinaryImage("docs/office_desk").overlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"
    )
  )
);
```

```python
CloudinaryImage("docs/office_desk").image(transformation=[
  {'overlay': {'url': "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"}},
  {'flags': "layer_apply"}
  ])
```

```php
(new ImageTag('docs/office_desk'))
	->overlay(Overlay::source(
	Source::fetch("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png")));
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new FetchLayer().url("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png")).chain()
  .flags("layer_apply")).imageTag("docs/office_desk");
```

```ruby
cl_image_tag("docs/office_desk", transformation: [
  {overlay: {url: "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"}},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new FetchLayer("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png")).Chain()
  .Flags("layer_apply")).BuildImageTag("docs/office_desk")
```

```dart
cloudinary.image('docs/office_desk').transformation(Transformation()
	.addTransformation("l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvbG9nb3MvY2xvdWRpbmFyeV9pY29uX3doaXRlLnBuZw/fl_layer_apply"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvbG9nb3MvY2xvdWRpbmFyeV9pY29uX3doaXRlLnBuZw").chain()
  .setFlags("layer_apply")).generate("docs/office_desk")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new FetchLayer().url("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png")).chain()
  .flags("layer_apply")).generate("docs/office_desk");
```

```flutter
cloudinary.image('docs/office_desk').transformation(Transformation()
	.addTransformation("l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvbG9nb3MvY2xvdWRpbmFyeV9pY29uX3doaXRlLnBuZw/fl_layer_apply"));
```

```kotlin
cloudinary.image {
	publicId("docs/office_desk")
	 overlay(Overlay.source(
	Source.fetch("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"))) 
}.generate()
```

```jquery
$.cloudinary.image("docs/office_desk", {transformation: [
  {overlay: new cloudinary.FetchLayer().url("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png")},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryImage("docs/office_desk").overlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"
    )
  )
);
```

![Video with remote overlay](https://res.cloudinary.com/demo/video/upload/l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvbG9nb3MvY2xvdWRpbmFyeV9pY29uX3doaXRlLnBuZw/fl_layer_apply/blue_sports_car.mp4 "thumb: w_500")

```nodejs
cloudinary.video("blue_sports_car", {transformation: [
  {overlay: {url: "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"}},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryVideo("blue_sports_car.mp4").overlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"
    )
  )
);
```

```vue
new CloudinaryVideo("blue_sports_car.mp4").overlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"
    )
  )
);
```

```angular
new CloudinaryVideo("blue_sports_car.mp4").overlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"
    )
  )
);
```

```js
new CloudinaryVideo("blue_sports_car.mp4").overlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"
    )
  )
);
```

```python
CloudinaryVideo("blue_sports_car").video(transformation=[
  {'overlay': {'url': "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"}},
  {'flags': "layer_apply"}
  ])
```

```php
(new VideoTag('blue_sports_car.mp4'))
	->overlay(Overlay::source(
	Source::fetch("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png")));
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new FetchLayer().url("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png")).chain()
  .flags("layer_apply")).videoTag("blue_sports_car");
```

```ruby
cl_video_tag("blue_sports_car", transformation: [
  {overlay: {url: "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"}},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Overlay(new FetchLayer("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png")).Chain()
  .Flags("layer_apply")).BuildVideoTag("blue_sports_car")
```

```dart
cloudinary.video('blue_sports_car.mp4').transformation(Transformation()
	.addTransformation("l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvbG9nb3MvY2xvdWRpbmFyeV9pY29uX3doaXRlLnBuZw/fl_layer_apply"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setOverlay("fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvbG9nb3MvY2xvdWRpbmFyeV9pY29uX3doaXRlLnBuZw").chain()
  .setFlags("layer_apply")).generate("blue_sports_car.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new FetchLayer().url("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png")).chain()
  .flags("layer_apply")).resourceType("video").generate("blue_sports_car.mp4");
```

```flutter
cloudinary.video('blue_sports_car.mp4').transformation(Transformation()
	.addTransformation("l_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvbG9nb3MvY2xvdWRpbmFyeV9pY29uX3doaXRlLnBuZw/fl_layer_apply"));
```

```kotlin
cloudinary.video {
	publicId("blue_sports_car.mp4")
	 overlay(Overlay.source(
	Source.fetch("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"))) 
}.generate()
```

```jquery
$.cloudinary.video("blue_sports_car", {transformation: [
  {overlay: new cloudinary.FetchLayer().url("https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png")},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryVideo("blue_sports_car.mp4").overlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/logos/cloudinary_icon_white.png"
    )
  )
);
```

> **NOTE**: The Cloudinary SDKs automatically generate a base64 encoded URL for a given HTTP/S URL, but if you generate the delivery URL in your own code, then you'll need to supply the fetch URL in base64 encoding with padding.

**See full syntax**: [l_fetch](transformation_reference#l_fetch) in the _Transformation Reference_.
### Text overlays

Add a text overlay over the base image with the `text` property of the `layer` parameter ( `l_text:` in URLs). The parameter also requires specifying font family and size (separated with an underscore and followed by a colon), and the text string to display. The general URL syntax for adding a text layer takes the following form:

```
l_text:<text styling options>/<optional transformations>/fl_layer_apply,<optional placement qualifiers>
```

In addition to the required font and size styling values, you can optionally specify a variety of other CSS-like [styling parameters](#styling_parameters) and to further customize your text layers by specifying text color, adding line breaks, emojis and other special characters, and other [text layer options](#text_layer_options).

Cloudinary first generates an image from the text definition and then overlays it like any other image overlay, and thus supports all the same [transformations](#layer_transformations) that any image overlay supports.

For example, to overlay the text string "Coffee" in the Arial font with a size of 80 pixels (`l_text:Arial_80:Coffee/fl_layer_apply`):

![Adding dynamic text to image](https://res.cloudinary.com/demo/image/upload/l_text:Arial_80:Coffee/fl_layer_apply/docs/cappuccino.jpg "thumb: w_500")

```nodejs
cloudinary.image("docs/cappuccino.jpg", {transformation: [
  {overlay: {font_family: "Arial", font_size: 80, text: "Coffee"}},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryImage("docs/cappuccino.jpg").overlay(
  source(text("Coffee", new TextStyle("Arial", 80)))
);
```

```vue
new CloudinaryImage("docs/cappuccino.jpg").overlay(
  source(text("Coffee", new TextStyle("Arial", 80)))
);
```

```angular
new CloudinaryImage("docs/cappuccino.jpg").overlay(
  source(text("Coffee", new TextStyle("Arial", 80)))
);
```

```js
new CloudinaryImage("docs/cappuccino.jpg").overlay(
  source(text("Coffee", new TextStyle("Arial", 80)))
);
```

```python
CloudinaryImage("docs/cappuccino.jpg").image(transformation=[
  {'overlay': {'font_family': "Arial", 'font_size': 80, 'text': "Coffee"}},
  {'flags': "layer_apply"}
  ])
```

```php
(new ImageTag('docs/cappuccino.jpg'))
	->overlay(Overlay::source(
	Source::text("Coffee",(new TextStyle("Arial",80)))));
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(80).text("Coffee")).chain()
  .flags("layer_apply")).imageTag("docs/cappuccino.jpg");
```

```ruby
cl_image_tag("docs/cappuccino.jpg", transformation: [
  {overlay: {font_family: "Arial", font_size: 80, text: "Coffee"}},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new TextLayer().FontFamily("Arial").FontSize(80).Text("Coffee")).Chain()
  .Flags("layer_apply")).BuildImageTag("docs/cappuccino.jpg")
```

```dart
cloudinary.image('docs/cappuccino.jpg').transformation(Transformation()
	.addTransformation("l_text:Arial_80:Coffee/fl_layer_apply"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("text:Arial_80:Coffee").chain()
  .setFlags("layer_apply")).generate("docs/cappuccino.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(80).text("Coffee")).chain()
  .flags("layer_apply")).generate("docs/cappuccino.jpg");
```

```flutter
cloudinary.image('docs/cappuccino.jpg').transformation(Transformation()
	.addTransformation("l_text:Arial_80:Coffee/fl_layer_apply"));
```

```kotlin
cloudinary.image {
	publicId("docs/cappuccino.jpg")
	 overlay(Overlay.source(
	Source.text("Coffee",TextStyle("Arial",80)))) 
}.generate()
```

```jquery
$.cloudinary.image("docs/cappuccino.jpg", {transformation: [
  {overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(80).text("Coffee")},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryImage("docs/cappuccino.jpg").overlay(
  source(text("Coffee", new TextStyle("Arial", 80)))
);
```

![Adding dynamic text to video](https://res.cloudinary.com/demo/video/upload/l_text:Arial_80:Coffee/fl_layer_apply/coffee_drinking.mp4 "thumb: w_500")

```nodejs
cloudinary.video("coffee_drinking", {transformation: [
  {overlay: {font_family: "Arial", font_size: 80, text: "Coffee"}},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryVideo("coffee_drinking.mp4").overlay(
  source(text("Coffee", new TextStyle("Arial", 80)))
);
```

```vue
new CloudinaryVideo("coffee_drinking.mp4").overlay(
  source(text("Coffee", new TextStyle("Arial", 80)))
);
```

```angular
new CloudinaryVideo("coffee_drinking.mp4").overlay(
  source(text("Coffee", new TextStyle("Arial", 80)))
);
```

```js
new CloudinaryVideo("coffee_drinking.mp4").overlay(
  source(text("Coffee", new TextStyle("Arial", 80)))
);
```

```python
CloudinaryVideo("coffee_drinking").video(transformation=[
  {'overlay': {'font_family': "Arial", 'font_size': 80, 'text': "Coffee"}},
  {'flags': "layer_apply"}
  ])
```

```php
(new VideoTag('coffee_drinking.mp4'))
	->overlay(Overlay::source(
	Source::text("Coffee",(new TextStyle("Arial",80)))));
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(80).text("Coffee")).chain()
  .flags("layer_apply")).videoTag("coffee_drinking");
```

```ruby
cl_video_tag("coffee_drinking", transformation: [
  {overlay: {font_family: "Arial", font_size: 80, text: "Coffee"}},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Overlay(new TextLayer().FontFamily("Arial").FontSize(80).Text("Coffee")).Chain()
  .Flags("layer_apply")).BuildVideoTag("coffee_drinking")
```

```dart
cloudinary.video('coffee_drinking.mp4').transformation(Transformation()
	.addTransformation("l_text:Arial_80:Coffee/fl_layer_apply"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setOverlay("text:Arial_80:Coffee").chain()
  .setFlags("layer_apply")).generate("coffee_drinking.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Arial").fontSize(80).text("Coffee")).chain()
  .flags("layer_apply")).resourceType("video").generate("coffee_drinking.mp4");
```

```flutter
cloudinary.video('coffee_drinking.mp4').transformation(Transformation()
	.addTransformation("l_text:Arial_80:Coffee/fl_layer_apply"));
```

```kotlin
cloudinary.video {
	publicId("coffee_drinking.mp4")
	 overlay(Overlay.source(
	Source.text("Coffee",TextStyle("Arial",80)))) 
}.generate()
```

```jquery
$.cloudinary.video("coffee_drinking", {transformation: [
  {overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(80).text("Coffee")},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryVideo("coffee_drinking.mp4").overlay(
  source(text("Coffee", new TextStyle("Arial", 80)))
);
```

**See full syntax**: [l_text](transformation_reference#l_text) in the _Transformation Reference_.

**Try it out**: [Layers](https://console.cloudinary.com/app/image/home/layers?media=image&collection=image&sample=me%2Flayers-fashion-1.jpeg&variant=banner&imageCompass=north_east&textCompass=center&text=NEW+COLLECTION).

## Layer placement

The `fl_layer_apply` component not only acts as the closing bracket for the layer, but is also used to include any options that will control how the layer is placed on the base image, and any details regarding the relationship between the overlay element and the base image.

> **NOTE**: Some Cloudinary SDKs use layer apply flags as described, and any placement qualifiers must also be the last component of the layer transformation. However some of the Cloudinary SDKs do not use a specific layer apply flag. Instead, when the SDK generates the transformation URL from your code, it automatically adds the fl_layer_apply flag together with placement qualifiers based on the transformation hierarchy in your SDK code.
### Positioning layers with gravity

To determine the position of the new layer, you can add the [gravity](transformation_reference#g_gravity) parameter to define the location to place the layer within the base image ('center' by default). The `gravity` parameter is added in the same component as the `layer_apply` flag. 

For example, to add an image overlay to the base image with gravity set to west (`l_lotus_layer/fl_layer_apply,g_west`):

![Image with precisely placed overlay](https://res.cloudinary.com/demo/image/upload/l_lotus_layer/w_0.5/fl_layer_apply,g_west/docs/camera.jpg "thumb: w_500")

```nodejs
cloudinary.image("docs/camera.jpg", {transformation: [
  {overlay: "lotus_layer"},
  {width: "0.5", crop: "scale"},
  {flags: "layer_apply", gravity: "west"}
  ]})
```

```react
new CloudinaryImage("docs/camera.jpg").overlay(
  source(
    image("lotus_layer").transformation(
      new Transformation().resize(scale().width(0.5))
    )
  ).position(new Position().gravity(compass("west")))
);
```

```vue
new CloudinaryImage("docs/camera.jpg").overlay(
  source(
    image("lotus_layer").transformation(
      new Transformation().resize(scale().width(0.5))
    )
  ).position(new Position().gravity(compass("west")))
);
```

```angular
new CloudinaryImage("docs/camera.jpg").overlay(
  source(
    image("lotus_layer").transformation(
      new Transformation().resize(scale().width(0.5))
    )
  ).position(new Position().gravity(compass("west")))
);
```

```js
new CloudinaryImage("docs/camera.jpg").overlay(
  source(
    image("lotus_layer").transformation(
      new Transformation().resize(scale().width(0.5))
    )
  ).position(new Position().gravity(compass("west")))
);
```

```python
CloudinaryImage("docs/camera.jpg").image(transformation=[
  {'overlay': "lotus_layer"},
  {'width': "0.5", 'crop': "scale"},
  {'flags': "layer_apply", 'gravity': "west"}
  ])
```

```php
(new ImageTag('docs/camera.jpg'))
	->overlay(Overlay::source(
	Source::image("lotus_layer")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(0.5)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::west()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("lotus_layer")).chain()
  .width(0.5).crop("scale").chain()
  .flags("layer_apply").gravity("west")).imageTag("docs/camera.jpg");
```

```ruby
cl_image_tag("docs/camera.jpg", transformation: [
  {overlay: "lotus_layer"},
  {width: 0.5, crop: "scale"},
  {flags: "layer_apply", gravity: "west"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("lotus_layer")).Chain()
  .Width(0.5).Crop("scale").Chain()
  .Flags("layer_apply").Gravity("west")).BuildImageTag("docs/camera.jpg")
```

```dart
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("lotus_layer")
	.transformation(new Transformation()
	.resize(Resize.scale().width(0.5)))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.west()))
	)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("lotus_layer").chain()
  .setWidth(0.5).setCrop("scale").chain()
  .setFlags("layer_apply").setGravity("west")).generate("docs/camera.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("lotus_layer")).chain()
  .width(0.5).crop("scale").chain()
  .flags("layer_apply").gravity("west")).generate("docs/camera.jpg");
```

```flutter
cloudinary.image('docs/camera.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("lotus_layer")
	.transformation(new Transformation()
	.resize(Resize.scale().width(0.5)))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.west()))
	)
	));
```

```kotlin
cloudinary.image {
	publicId("docs/camera.jpg")
	 overlay(Overlay.source(
	Source.image("lotus_layer") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(0.5F) }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.west()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/camera.jpg", {transformation: [
  {overlay: new cloudinary.Layer().publicId("lotus_layer")},
  {width: "0.5", crop: "scale"},
  {flags: "layer_apply", gravity: "west"}
  ]})
```

```react_native
new CloudinaryImage("docs/camera.jpg").overlay(
  source(
    image("lotus_layer").transformation(
      new Transformation().resize(scale().width(0.5))
    )
  ).position(new Position().gravity(compass("west")))
);
```
    
![Video with precisely placed overlay](https://res.cloudinary.com/demo/video/upload/l_lotus_layer/fl_layer_apply,g_west/docs/sunglasses.mp4 "thumb: w_500")

```nodejs
cloudinary.video("docs/sunglasses", {transformation: [
  {overlay: "lotus_layer"},
  {flags: "layer_apply", gravity: "west"}
  ]})
```

```react
new CloudinaryVideo("docs/sunglasses.mp4").overlay(
  source(image("lotus_layer")).position(new Position().gravity(compass("west")))
);
```

```vue
new CloudinaryVideo("docs/sunglasses.mp4").overlay(
  source(image("lotus_layer")).position(new Position().gravity(compass("west")))
);
```

```angular
new CloudinaryVideo("docs/sunglasses.mp4").overlay(
  source(image("lotus_layer")).position(new Position().gravity(compass("west")))
);
```

```js
new CloudinaryVideo("docs/sunglasses.mp4").overlay(
  source(image("lotus_layer")).position(new Position().gravity(compass("west")))
);
```

```python
CloudinaryVideo("docs/sunglasses").video(transformation=[
  {'overlay': "lotus_layer"},
  {'flags': "layer_apply", 'gravity': "west"}
  ])
```

```php
(new VideoTag('docs/sunglasses.mp4'))
	->overlay(Overlay::source(
	Source::image("lotus_layer"))
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::west()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("lotus_layer")).chain()
  .flags("layer_apply").gravity("west")).videoTag("docs/sunglasses");
```

```ruby
cl_video_tag("docs/sunglasses", transformation: [
  {overlay: "lotus_layer"},
  {flags: "layer_apply", gravity: "west"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("lotus_layer")).Chain()
  .Flags("layer_apply").Gravity("west")).BuildVideoTag("docs/sunglasses")
```

```dart
cloudinary.video('docs/sunglasses.mp4').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("lotus_layer"))
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.west()))
	)
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setOverlay("lotus_layer").chain()
  .setFlags("layer_apply").setGravity("west")).generate("docs/sunglasses.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("lotus_layer")).chain()
  .flags("layer_apply").gravity("west")).resourceType("video").generate("docs/sunglasses.mp4");
```

```flutter
cloudinary.video('docs/sunglasses.mp4').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("lotus_layer"))
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.west()))
	)
	));
```

```kotlin
cloudinary.video {
	publicId("docs/sunglasses.mp4")
	 overlay(Overlay.source(
	Source.image("lotus_layer")) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.west()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("docs/sunglasses", {transformation: [
  {overlay: new cloudinary.Layer().publicId("lotus_layer")},
  {flags: "layer_apply", gravity: "west"}
  ]})
```

```react_native
new CloudinaryVideo("docs/sunglasses.mp4").overlay(
  source(image("lotus_layer")).position(new Position().gravity(compass("west")))
);
```

To fine tune the exact location of the layer, you can offset the overlay from the focus of gravity by also adding the `x` and `y` coordinate offset parameters. These parameters accept either integer values representing the number of pixels to adjust the overlay position in the horizontal or vertical directions, or decimal values representing a percentage-based offset relative to the containing image (e.g., 0.2 for an offset of 20%).

For example, to place a text overlay at a vertical distance of 5% from the top of the image (`l_text:Roboto_400:Paradise/fl_layer_apply,g_north,y_0.05`):

![Text added to image using % offset](https://res.cloudinary.com/demo/image/upload/l_text:Roboto_400:Paradise/fl_layer_apply,g_north,y_0.05/docs/row-boat-sea-mountains.jpg "thumb: w_500")

```nodejs
cloudinary.image("docs/row-boat-sea-mountains.jpg", {transformation: [
  {overlay: {font_family: "Roboto", font_size: 400, text: "Paradise"}},
  {flags: "layer_apply", gravity: "north", y: "0.05"}
  ]})
```

```react
new CloudinaryImage("docs/row-boat-sea-mountains.jpg").overlay(
  source(text("Paradise", new TextStyle("Roboto", 400))).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(0.05)
  )
);
```

```vue
new CloudinaryImage("docs/row-boat-sea-mountains.jpg").overlay(
  source(text("Paradise", new TextStyle("Roboto", 400))).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(0.05)
  )
);
```

```angular
new CloudinaryImage("docs/row-boat-sea-mountains.jpg").overlay(
  source(text("Paradise", new TextStyle("Roboto", 400))).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(0.05)
  )
);
```

```js
new CloudinaryImage("docs/row-boat-sea-mountains.jpg").overlay(
  source(text("Paradise", new TextStyle("Roboto", 400))).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(0.05)
  )
);
```

```python
CloudinaryImage("docs/row-boat-sea-mountains.jpg").image(transformation=[
  {'overlay': {'font_family': "Roboto", 'font_size': 400, 'text': "Paradise"}},
  {'flags': "layer_apply", 'gravity': "north", 'y': "0.05"}
  ])
```

```php
(new ImageTag('docs/row-boat-sea-mountains.jpg'))
	->overlay(Overlay::source(
	Source::text("Paradise",(new TextStyle("Roboto",400))))
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::north()))
->offsetY(0.05))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Roboto").fontSize(400).text("Paradise")).chain()
  .flags("layer_apply").gravity("north").y(0.05)).imageTag("docs/row-boat-sea-mountains.jpg");
```

```ruby
cl_image_tag("docs/row-boat-sea-mountains.jpg", transformation: [
  {overlay: {font_family: "Roboto", font_size: 400, text: "Paradise"}},
  {flags: "layer_apply", gravity: "north", y: 0.05}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new TextLayer().FontFamily("Roboto").FontSize(400).Text("Paradise")).Chain()
  .Flags("layer_apply").Gravity("north").Y(0.05)).BuildImageTag("docs/row-boat-sea-mountains.jpg")
```

```dart
cloudinary.image('docs/row-boat-sea-mountains.jpg').transformation(Transformation()
	.addTransformation("l_text:Roboto_400:Paradise/fl_layer_apply,g_north,y_0.05"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("text:Roboto_400:Paradise").chain()
  .setFlags("layer_apply").setGravity("north").setY(0.05)).generate("docs/row-boat-sea-mountains.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Roboto").fontSize(400).text("Paradise")).chain()
  .flags("layer_apply").gravity("north").y(0.05)).generate("docs/row-boat-sea-mountains.jpg");
```

```flutter
cloudinary.image('docs/row-boat-sea-mountains.jpg').transformation(Transformation()
	.addTransformation("l_text:Roboto_400:Paradise/fl_layer_apply,g_north,y_0.05"));
```

```kotlin
cloudinary.image {
	publicId("docs/row-boat-sea-mountains.jpg")
	 overlay(Overlay.source(
	Source.text("Paradise",TextStyle("Roboto",400))) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.north()))
 offsetY(0.05F) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/row-boat-sea-mountains.jpg", {transformation: [
  {overlay: new cloudinary.TextLayer().fontFamily("Roboto").fontSize(400).text("Paradise")},
  {flags: "layer_apply", gravity: "north", y: "0.05"}
  ]})
```

```react_native
new CloudinaryImage("docs/row-boat-sea-mountains.jpg").overlay(
  source(text("Paradise", new TextStyle("Roboto", 400))).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(0.05)
  )
);
```

![Text added to video using % offset](https://res.cloudinary.com/demo/video/upload/l_text:Roboto_400:Paradise/fl_layer_apply,g_north,y_0.05/paradise_location.mp4 "thumb: w_500")

```nodejs
cloudinary.video("paradise_location", {transformation: [
  {overlay: {font_family: "Roboto", font_size: 400, text: "Paradise"}},
  {flags: "layer_apply", gravity: "north", y: "0.05"}
  ]})
```

```react
new CloudinaryVideo("paradise_location.mp4").overlay(
  source(text("Paradise", new TextStyle("Roboto", 400))).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(0.05)
  )
);
```

```vue
new CloudinaryVideo("paradise_location.mp4").overlay(
  source(text("Paradise", new TextStyle("Roboto", 400))).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(0.05)
  )
);
```

```angular
new CloudinaryVideo("paradise_location.mp4").overlay(
  source(text("Paradise", new TextStyle("Roboto", 400))).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(0.05)
  )
);
```

```js
new CloudinaryVideo("paradise_location.mp4").overlay(
  source(text("Paradise", new TextStyle("Roboto", 400))).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(0.05)
  )
);
```

```python
CloudinaryVideo("paradise_location").video(transformation=[
  {'overlay': {'font_family': "Roboto", 'font_size': 400, 'text': "Paradise"}},
  {'flags': "layer_apply", 'gravity': "north", 'y': "0.05"}
  ])
```

```php
(new VideoTag('paradise_location.mp4'))
	->overlay(Overlay::source(
	Source::text("Paradise",(new TextStyle("Roboto",400))))
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::north()))
->offsetY(0.05))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Roboto").fontSize(400).text("Paradise")).chain()
  .flags("layer_apply").gravity("north").y(0.05)).videoTag("paradise_location");
```

```ruby
cl_video_tag("paradise_location", transformation: [
  {overlay: {font_family: "Roboto", font_size: 400, text: "Paradise"}},
  {flags: "layer_apply", gravity: "north", y: 0.05}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Overlay(new TextLayer().FontFamily("Roboto").FontSize(400).Text("Paradise")).Chain()
  .Flags("layer_apply").Gravity("north").Y(0.05)).BuildVideoTag("paradise_location")
```

```dart
cloudinary.video('paradise_location.mp4').transformation(Transformation()
	.addTransformation("l_text:Roboto_400:Paradise/fl_layer_apply,g_north,y_0.05"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setOverlay("text:Roboto_400:Paradise").chain()
  .setFlags("layer_apply").setGravity("north").setY(0.05)).generate("paradise_location.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new TextLayer().fontFamily("Roboto").fontSize(400).text("Paradise")).chain()
  .flags("layer_apply").gravity("north").y(0.05)).resourceType("video").generate("paradise_location.mp4");
```

```flutter
cloudinary.video('paradise_location.mp4').transformation(Transformation()
	.addTransformation("l_text:Roboto_400:Paradise/fl_layer_apply,g_north,y_0.05"));
```

```kotlin
cloudinary.video {
	publicId("paradise_location.mp4")
	 overlay(Overlay.source(
	Source.text("Paradise",TextStyle("Roboto",400))) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.north()))
 offsetY(0.05F) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("paradise_location", {transformation: [
  {overlay: new cloudinary.TextLayer().fontFamily("Roboto").fontSize(400).text("Paradise")},
  {flags: "layer_apply", gravity: "north", y: "0.05"}
  ]})
```

```react_native
new CloudinaryVideo("paradise_location.mp4").overlay(
  source(text("Paradise", new TextStyle("Roboto", 400))).position(
    new Position()
      .gravity(compass("north"))
      .offsetY(0.05)
  )
);
```

The direction of x and y depends on the compass position:

Compass position | Positive x | Positive y | Negative x | Negative y
--|--|--|--|--
`center`, `north_west`, `north`, `west` | right | down | left | up
`north_east`, `east` | left | down | right | up
`south_east` | left | up | right | down
`south`, `south_west` | right | up | left | down

> **TIP**: See the [Positioning with Gravity
](https://cloudinary-training.github.io/cld-advanced-concepts/overlay-underlay/positioning-app/docs/index.html) interactive demo to experiment with gravity and coordinate parameters.
 
> **TIP**: By specifying positions that are outside the dimensions of the base image, you can [create image collages](image_collage_generation#create_collages_using_overlays).

### Overlays on special positions

The gravity parameter can also be set to a custom region within an image, which becomes the focus when placing the overlay. These 'special positions' are locations within the image that are either automatically detected by Cloudinary (e.g., a [face](face_detection_based_transformations#position_overlays_on_detected_faces)), [custom coordinates](custom_focus_areas#custom_coordinates) that were previously specified (e.g., as part of the [upload](image_upload_api_reference#upload) method), or detected by one of the Cloudinary add-ons (e.g., eyes or text within the image). 

For a full list of all the special positions available to use for placing overlays with the gravity parameter, see the [\<special position\>](transformation_reference#g_special_position) section in the _Transformation Reference_.

For example:

1. Add an overlay of the `purple-mask` image over all faces detected in the `couple-cornfield` image: 

    ![Image with overlay placed over faces](https://res.cloudinary.com/demo/image/upload/l_docs:purple-mask/c_scale,w_150/fl_layer_apply,g_faces/docs/couple-cornfield.jpg)

```nodejs
cloudinary.image("docs/couple-cornfield.jpg", {transformation: [
  {overlay: "docs:purple-mask"},
  {width: 150, crop: "scale"},
  {flags: "layer_apply", gravity: "faces"}
  ]})
```

```react
new CloudinaryImage("docs/couple-cornfield.jpg").overlay(
  source(
    image("docs/purple-mask").transformation(
      new Transformation().resize(scale().width(150))
    )
  ).position(new Position().gravity(focusOn(faces())))
);
```

```vue
new CloudinaryImage("docs/couple-cornfield.jpg").overlay(
  source(
    image("docs/purple-mask").transformation(
      new Transformation().resize(scale().width(150))
    )
  ).position(new Position().gravity(focusOn(faces())))
);
```

```angular
new CloudinaryImage("docs/couple-cornfield.jpg").overlay(
  source(
    image("docs/purple-mask").transformation(
      new Transformation().resize(scale().width(150))
    )
  ).position(new Position().gravity(focusOn(faces())))
);
```

```js
new CloudinaryImage("docs/couple-cornfield.jpg").overlay(
  source(
    image("docs/purple-mask").transformation(
      new Transformation().resize(scale().width(150))
    )
  ).position(new Position().gravity(focusOn(faces())))
);
```

```python
CloudinaryImage("docs/couple-cornfield.jpg").image(transformation=[
  {'overlay': "docs:purple-mask"},
  {'width': 150, 'crop': "scale"},
  {'flags': "layer_apply", 'gravity': "faces"}
  ])
```

```php
(new ImageTag('docs/couple-cornfield.jpg'))
	->overlay(Overlay::source(
	Source::image("docs/purple-mask")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(150)))
	)
	->position((new Position())
	->gravity(
	Gravity::focusOn(
	FocusOn::faces()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:purple-mask")).chain()
  .width(150).crop("scale").chain()
  .flags("layer_apply").gravity("faces")).imageTag("docs/couple-cornfield.jpg");
```

```ruby
cl_image_tag("docs/couple-cornfield.jpg", transformation: [
  {overlay: "docs:purple-mask"},
  {width: 150, crop: "scale"},
  {flags: "layer_apply", gravity: "faces"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("docs:purple-mask")).Chain()
  .Width(150).Crop("scale").Chain()
  .Flags("layer_apply").Gravity("faces")).BuildImageTag("docs/couple-cornfield.jpg")
```

```dart
cloudinary.image('docs/couple-cornfield.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/purple-mask")
	.transformation(new Transformation()
	.resize(Resize.scale().width(150)))
	)
	.position(Position()
	.gravity(
	Gravity.focusOn(
	FocusOn.faces()))
	)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("docs:purple-mask").chain()
  .setWidth(150).setCrop("scale").chain()
  .setFlags("layer_apply").setGravity("faces")).generate("docs/couple-cornfield.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("docs:purple-mask")).chain()
  .width(150).crop("scale").chain()
  .flags("layer_apply").gravity("faces")).generate("docs/couple-cornfield.jpg");
```

```flutter
cloudinary.image('docs/couple-cornfield.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("docs/purple-mask")
	.transformation(new Transformation()
	.resize(Resize.scale().width(150)))
	)
	.position(Position()
	.gravity(
	Gravity.focusOn(
	FocusOn.faces()))
	)
	));
```

```kotlin
cloudinary.image {
	publicId("docs/couple-cornfield.jpg")
	 overlay(Overlay.source(
	Source.image("docs/purple-mask") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(150) }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.focusOn(
	FocusOn.faces()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/couple-cornfield.jpg", {transformation: [
  {overlay: new cloudinary.Layer().publicId("docs:purple-mask")},
  {width: 150, crop: "scale"},
  {flags: "layer_apply", gravity: "faces"}
  ]})
```

```react_native
new CloudinaryImage("docs/couple-cornfield.jpg").overlay(
  source(
    image("docs/purple-mask").transformation(
      new Transformation().resize(scale().width(150))
    )
  ).position(new Position().gravity(focusOn(faces())))
);
```

2. Use the [OCR Text Detection and Extraction](ocr_text_detection_and_extraction_addon) add-on to add an overlay with your site's contact information that covers any detected text in an uploaded image: 

    ![Image with overlay placed over faces](https://res.cloudinary.com/demo/image/upload/l_call_text/c_scale,fl_region_relative,w_1.0/fl_layer_apply,g_ocr_text/red_stop_sign.jpg)

```nodejs
cloudinary.image("red_stop_sign.jpg", {transformation: [
  {overlay: "call_text"},
  {flags: "region_relative", width: "1.0", crop: "scale"},
  {flags: "layer_apply", gravity: "ocr_text"}
  ]})
```

```react
new CloudinaryImage("red_stop_sign.jpg").overlay(
  source(
    image("call_text").transformation(
      new Transformation().resize(scale().width("1.0").regionRelative())
    )
  ).position(new Position().gravity(focusOn(ocr())))
);
```

```vue
new CloudinaryImage("red_stop_sign.jpg").overlay(
  source(
    image("call_text").transformation(
      new Transformation().resize(scale().width("1.0").regionRelative())
    )
  ).position(new Position().gravity(focusOn(ocr())))
);
```

```angular
new CloudinaryImage("red_stop_sign.jpg").overlay(
  source(
    image("call_text").transformation(
      new Transformation().resize(scale().width("1.0").regionRelative())
    )
  ).position(new Position().gravity(focusOn(ocr())))
);
```

```js
new CloudinaryImage("red_stop_sign.jpg").overlay(
  source(
    image("call_text").transformation(
      new Transformation().resize(scale().width("1.0").regionRelative())
    )
  ).position(new Position().gravity(focusOn(ocr())))
);
```

```python
CloudinaryImage("red_stop_sign.jpg").image(transformation=[
  {'overlay': "call_text"},
  {'flags': "region_relative", 'width': "1.0", 'crop': "scale"},
  {'flags': "layer_apply", 'gravity': "ocr_text"}
  ])
```

```php
(new ImageTag('red_stop_sign.jpg'))
	->overlay(Overlay::source(
	Source::image("call_text")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(1.0)
	->regionRelative()
	))
	)
	->position((new Position())
	->gravity(
	Gravity::focusOn(
	FocusOn::ocr()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("call_text")).chain()
  .flags("region_relative").width(1.0).crop("scale").chain()
  .flags("layer_apply").gravity("ocr_text")).imageTag("red_stop_sign.jpg");
```

```ruby
cl_image_tag("red_stop_sign.jpg", transformation: [
  {overlay: "call_text"},
  {flags: "region_relative", width: 1.0, crop: "scale"},
  {flags: "layer_apply", gravity: "ocr_text"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("call_text")).Chain()
  .Flags("region_relative").Width(1.0).Crop("scale").Chain()
  .Flags("layer_apply").Gravity("ocr_text")).BuildImageTag("red_stop_sign.jpg")
```

```dart
cloudinary.image('red_stop_sign.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("call_text")
	.transformation(new Transformation()
	.resize(Resize.scale().width('1.0')
	.regionRelative()
	))
	)
	.position(Position()
	.gravity(
	Gravity.focusOn(
	FocusOn.ocr()))
	)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("call_text").chain()
  .setFlags("region_relative").setWidth(1.0).setCrop("scale").chain()
  .setFlags("layer_apply").setGravity("ocr_text")).generate("red_stop_sign.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("call_text")).chain()
  .flags("region_relative").width(1.0).crop("scale").chain()
  .flags("layer_apply").gravity("ocr_text")).generate("red_stop_sign.jpg");
```

```flutter
cloudinary.image('red_stop_sign.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("call_text")
	.transformation(new Transformation()
	.resize(Resize.scale().width('1.0')
	.regionRelative()
	))
	)
	.position(Position()
	.gravity(
	Gravity.focusOn(
	FocusOn.ocr()))
	)
	));
```

```kotlin
cloudinary.image {
	publicId("red_stop_sign.jpg")
	 overlay(Overlay.source(
	Source.image("call_text") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(1.0F)
	 regionRelative()
	 }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.focusOn(
	FocusOn.ocr()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("red_stop_sign.jpg", {transformation: [
  {overlay: new cloudinary.Layer().publicId("call_text")},
  {flags: "region_relative", width: "1.0", crop: "scale"},
  {flags: "layer_apply", gravity: "ocr_text"}
  ]})
```

```react_native
new CloudinaryImage("red_stop_sign.jpg").overlay(
  source(
    image("call_text").transformation(
      new Transformation().resize(scale().width("1.0").regionRelative())
    )
  ).position(new Position().gravity(focusOn(ocr())))
);
```

You may also want to position an overlay ensuring that it avoids a special position. See [Position overlays avoiding detected faces](face_detection_based_transformations#position_overlays_avoiding_detected_faces) for an example of how to achieve this.

{notes}

* When gravity is set to one of the special position values, and no special position is detected in the image, then no overlay is placed at all.
* Instead of specifying an absolute width for overlays, you can use the [fl_region_relative](#sizing_relative_to_the_detected_region) flag to place each overlay relative to the size of each detected region.
{/note}

> **TIP**: Instead of adding your layer image to a single, specific location, you can [tile your layer image](#automatic_tiling) over the entire base image. This is often useful when using image layers for [watermarking](#watermarking).   

### Layer overflow behavior

By default, if a layer (image or text) has a larger width or height than the base image, the delivered image canvas is resized to display the entire layer. If you want to ensure that the delivered size will never be larger than the base image, you can use the `fl_no_overflow` flag in the same component as the `layer_apply` flag.

For example, the `no_overflow` flag prevents the logo overlay from extending the canvas of the base image (`c_scale,w_400/l_cloudinary_icon_blue/fl_layer_apply,fl_no_overflow`):

![Prevent an overlay from extending the canvas of the base image](https://res.cloudinary.com/demo/image/upload/c_scale,w_400/l_cloudinary_icon_blue/fl_layer_apply,fl_no_overflow/piano.jpg "thumb: w_400")

```nodejs
cloudinary.image("piano.jpg", {transformation: [
  {width: 400, crop: "scale"},
  {overlay: "cloudinary_icon_blue"},
  {flags: ["layer_apply", "no_overflow"]}
  ]})
```

```react
new CloudinaryImage("piano.jpg")
  .resize(scale().width(400))
  .overlay(
    source(image("cloudinary_icon_blue")).position(
      new Position().allowOverflow(false)
    )
  );
```

```vue
new CloudinaryImage("piano.jpg")
  .resize(scale().width(400))
  .overlay(
    source(image("cloudinary_icon_blue")).position(
      new Position().allowOverflow(false)
    )
  );
```

```angular
new CloudinaryImage("piano.jpg")
  .resize(scale().width(400))
  .overlay(
    source(image("cloudinary_icon_blue")).position(
      new Position().allowOverflow(false)
    )
  );
```

```js
new CloudinaryImage("piano.jpg")
  .resize(scale().width(400))
  .overlay(
    source(image("cloudinary_icon_blue")).position(
      new Position().allowOverflow(false)
    )
  );
```

```python
CloudinaryImage("piano.jpg").image(transformation=[
  {'width': 400, 'crop': "scale"},
  {'overlay': "cloudinary_icon_blue"},
  {'flags': ["layer_apply", "no_overflow"]}
  ])
```

```php
(new ImageTag('piano.jpg'))
	->resize(Resize::scale()->width(400))
	->overlay(Overlay::source(
	Source::image("cloudinary_icon_blue"))
	->position((new Position())->allowOverflow(false))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(400).crop("scale").chain()
  .overlay(new Layer().publicId("cloudinary_icon_blue")).chain()
  .flags("layer_apply", "no_overflow")).imageTag("piano.jpg");
```

```ruby
cl_image_tag("piano.jpg", transformation: [
  {width: 400, crop: "scale"},
  {overlay: "cloudinary_icon_blue"},
  {flags: ["layer_apply", "no_overflow"]}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(400).Crop("scale").Chain()
  .Overlay(new Layer().PublicId("cloudinary_icon_blue")).Chain()
  .Flags("layer_apply", "no_overflow")).BuildImageTag("piano.jpg")
```

```dart
cloudinary.image('piano.jpg').transformation(Transformation()
	.resize(Resize.scale().width(400))
	.overlay(Overlay.source(
	Source.image("cloudinary_icon_blue"))
	.position(Position().allowOverflow(false))
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(400).setCrop("scale").chain()
  .setOverlay("cloudinary_icon_blue").chain()
  .setFlags("layer_apply", "no_overflow")).generate("piano.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(400).crop("scale").chain()
  .overlay(new Layer().publicId("cloudinary_icon_blue")).chain()
  .flags("layer_apply", "no_overflow")).generate("piano.jpg");
```

```flutter
cloudinary.image('piano.jpg').transformation(Transformation()
	.resize(Resize.scale().width(400))
	.overlay(Overlay.source(
	Source.image("cloudinary_icon_blue"))
	.position(Position().allowOverflow(false))
	));
```

```kotlin
cloudinary.image {
	publicId("piano.jpg")
	 resize(Resize.scale() { width(400) })
	 overlay(Overlay.source(
	Source.image("cloudinary_icon_blue")) {
	 position(Position() { allowOverflow(false) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("piano.jpg", {transformation: [
  {width: 400, crop: "scale"},
  {overlay: new cloudinary.Layer().publicId("cloudinary_icon_blue")},
  {flags: ["layer_apply", "no_overflow"]}
  ]})
```

```react_native
new CloudinaryImage("piano.jpg")
  .resize(scale().width(400))
  .overlay(
    source(image("cloudinary_icon_blue")).position(
      new Position().allowOverflow(false)
    )
  );
```

## Layer transformations

You can apply resizing and other [transformation options](transformation_reference) on your overlays just like any other asset delivered from Cloudinary. You can apply multiple ([chained](image_transformations#chained_transformations)) transformations to overlays by adding them in separate components before the `layer_apply` component. All chained transformations, until a transformation component that includes the `layer_apply` flag, are applied on the last added overlay or underlay instead of applying them on the base asset (the `layer_apply` flag closes the layer, similar to a closing bracket).

For example:

1. Adding a logo overlay scaled down to 50% of its original width and made into a watermark by reducing the opacity to 70% and increasing the brightness to 50% using the `brightness` effect. The transformed image is then placed as a layer in the top-right corner of the base image (`l_cloudinary_icon_blue/c_scale,w_0.5/o_70/e_brightness:50/fl_layer_apply,g_north_east`):

    ![Image with transformed overlay](https://res.cloudinary.com/demo/image/upload/l_cloudinary_icon_blue/c_scale,w_0.5/o_70/e_brightness:50/fl_layer_apply,g_north_east/guitar_end.jpg "thumb: w_500")

```nodejs
cloudinary.image("guitar_end.jpg", {transformation: [
  {overlay: "cloudinary_icon_blue"},
  {width: "0.5", crop: "scale"},
  {opacity: 70},
  {effect: "brightness:50"},
  {flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react
new CloudinaryImage("guitar_end.jpg").overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation()
        .resize(scale().width(0.5))
        .adjust(opacity(70))
        .adjust(brightness().level(50))
    )
  ).position(new Position().gravity(compass("north_east")))
);
```

```vue
new CloudinaryImage("guitar_end.jpg").overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation()
        .resize(scale().width(0.5))
        .adjust(opacity(70))
        .adjust(brightness().level(50))
    )
  ).position(new Position().gravity(compass("north_east")))
);
```

```angular
new CloudinaryImage("guitar_end.jpg").overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation()
        .resize(scale().width(0.5))
        .adjust(opacity(70))
        .adjust(brightness().level(50))
    )
  ).position(new Position().gravity(compass("north_east")))
);
```

```js
new CloudinaryImage("guitar_end.jpg").overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation()
        .resize(scale().width(0.5))
        .adjust(opacity(70))
        .adjust(brightness().level(50))
    )
  ).position(new Position().gravity(compass("north_east")))
);
```

```python
CloudinaryImage("guitar_end.jpg").image(transformation=[
  {'overlay': "cloudinary_icon_blue"},
  {'width': "0.5", 'crop': "scale"},
  {'opacity': 70},
  {'effect': "brightness:50"},
  {'flags': "layer_apply", 'gravity': "north_east"}
  ])
```

```php
(new ImageTag('guitar_end.jpg'))
	->overlay(Overlay::source(
	Source::image("cloudinary_icon_blue")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(0.5))
	->adjust(Adjust::opacity(70))
	->adjust(Adjust::brightness()->level(50)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northEast()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("cloudinary_icon_blue")).chain()
  .width(0.5).crop("scale").chain()
  .opacity(70).chain()
  .effect("brightness:50").chain()
  .flags("layer_apply").gravity("north_east")).imageTag("guitar_end.jpg");
```

```ruby
cl_image_tag("guitar_end.jpg", transformation: [
  {overlay: "cloudinary_icon_blue"},
  {width: 0.5, crop: "scale"},
  {opacity: 70},
  {effect: "brightness:50"},
  {flags: "layer_apply", gravity: "north_east"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("cloudinary_icon_blue")).Chain()
  .Width(0.5).Crop("scale").Chain()
  .Opacity(70).Chain()
  .Effect("brightness:50").Chain()
  .Flags("layer_apply").Gravity("north_east")).BuildImageTag("guitar_end.jpg")
```

```dart
cloudinary.image('guitar_end.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("cloudinary_icon_blue")
	.transformation(new Transformation()
	.resize(Resize.scale().width(0.5))
	.adjust(Adjust.opacity(70))
	.adjust(Adjust.brightness().level(50)))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northEast()))
	)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("cloudinary_icon_blue").chain()
  .setWidth(0.5).setCrop("scale").chain()
  .setOpacity(70).chain()
  .setEffect("brightness:50").chain()
  .setFlags("layer_apply").setGravity("north_east")).generate("guitar_end.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("cloudinary_icon_blue")).chain()
  .width(0.5).crop("scale").chain()
  .opacity(70).chain()
  .effect("brightness:50").chain()
  .flags("layer_apply").gravity("north_east")).generate("guitar_end.jpg");
```

```flutter
cloudinary.image('guitar_end.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("cloudinary_icon_blue")
	.transformation(new Transformation()
	.resize(Resize.scale().width(0.5))
	.adjust(Adjust.opacity(70))
	.adjust(Adjust.brightness().level(50)))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northEast()))
	)
	));
```

```kotlin
cloudinary.image {
	publicId("guitar_end.jpg")
	 overlay(Overlay.source(
	Source.image("cloudinary_icon_blue") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(0.5F) })
	 adjust(Adjust.opacity(70))
	 adjust(Adjust.brightness() { level(50) }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northEast()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("guitar_end.jpg", {transformation: [
  {overlay: new cloudinary.Layer().publicId("cloudinary_icon_blue")},
  {width: "0.5", crop: "scale"},
  {opacity: 70},
  {effect: "brightness:50"},
  {flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react_native
new CloudinaryImage("guitar_end.jpg").overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation()
        .resize(scale().width(0.5))
        .adjust(opacity(70))
        .adjust(brightness().level(50))
    )
  ).position(new Position().gravity(compass("north_east")))
);
```

    ![Video with transformed overlay](https://res.cloudinary.com/demo/video/upload/l_cloudinary_icon_blue/c_scale,w_0.5/o_70/e_brightness:50/fl_layer_apply,g_north_east/docs/mountain-aerial-view.mp4 "thumb: w_500")

```nodejs
cloudinary.video("docs/mountain-aerial-view", {transformation: [
  {overlay: "cloudinary_icon_blue"},
  {width: "0.5", crop: "scale"},
  {opacity: 70},
  {effect: "brightness:50"},
  {flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react
new CloudinaryVideo("docs/mountain-aerial-view.mp4").overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation()
        .resize(scale().width(0.5))
        .adjust(opacity(70))
        .adjust(brightness().level(50))
    )
  ).position(new Position().gravity(compass("north_east")))
);
```

```vue
new CloudinaryVideo("docs/mountain-aerial-view.mp4").overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation()
        .resize(scale().width(0.5))
        .adjust(opacity(70))
        .adjust(brightness().level(50))
    )
  ).position(new Position().gravity(compass("north_east")))
);
```

```angular
new CloudinaryVideo("docs/mountain-aerial-view.mp4").overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation()
        .resize(scale().width(0.5))
        .adjust(opacity(70))
        .adjust(brightness().level(50))
    )
  ).position(new Position().gravity(compass("north_east")))
);
```

```js
new CloudinaryVideo("docs/mountain-aerial-view.mp4").overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation()
        .resize(scale().width(0.5))
        .adjust(opacity(70))
        .adjust(brightness().level(50))
    )
  ).position(new Position().gravity(compass("north_east")))
);
```

```python
CloudinaryVideo("docs/mountain-aerial-view").video(transformation=[
  {'overlay': "cloudinary_icon_blue"},
  {'width': "0.5", 'crop': "scale"},
  {'opacity': 70},
  {'effect': "brightness:50"},
  {'flags': "layer_apply", 'gravity': "north_east"}
  ])
```

```php
(new VideoTag('docs/mountain-aerial-view.mp4'))
	->overlay(Overlay::source(
	Source::image("cloudinary_icon_blue")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(0.5))
	->adjust(Adjust::opacity(70))
	->adjust(Adjust::brightness()->level(50)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northEast()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("cloudinary_icon_blue")).chain()
  .width(0.5).crop("scale").chain()
  .opacity(70).chain()
  .effect("brightness:50").chain()
  .flags("layer_apply").gravity("north_east")).videoTag("docs/mountain-aerial-view");
```

```ruby
cl_video_tag("docs/mountain-aerial-view", transformation: [
  {overlay: "cloudinary_icon_blue"},
  {width: 0.5, crop: "scale"},
  {opacity: 70},
  {effect: "brightness:50"},
  {flags: "layer_apply", gravity: "north_east"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("cloudinary_icon_blue")).Chain()
  .Width(0.5).Crop("scale").Chain()
  .Opacity(70).Chain()
  .Effect("brightness:50").Chain()
  .Flags("layer_apply").Gravity("north_east")).BuildVideoTag("docs/mountain-aerial-view")
```

```dart
cloudinary.video('docs/mountain-aerial-view.mp4').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("cloudinary_icon_blue")
	.transformation(new Transformation()
	.resize(Resize.scale().width(0.5))
	.adjust(Adjust.opacity(70))
	.adjust(Adjust.brightness().level(50)))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northEast()))
	)
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setOverlay("cloudinary_icon_blue").chain()
  .setWidth(0.5).setCrop("scale").chain()
  .setOpacity(70).chain()
  .setEffect("brightness:50").chain()
  .setFlags("layer_apply").setGravity("north_east")).generate("docs/mountain-aerial-view.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("cloudinary_icon_blue")).chain()
  .width(0.5).crop("scale").chain()
  .opacity(70).chain()
  .effect("brightness:50").chain()
  .flags("layer_apply").gravity("north_east")).resourceType("video").generate("docs/mountain-aerial-view.mp4");
```

```flutter
cloudinary.video('docs/mountain-aerial-view.mp4').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("cloudinary_icon_blue")
	.transformation(new Transformation()
	.resize(Resize.scale().width(0.5))
	.adjust(Adjust.opacity(70))
	.adjust(Adjust.brightness().level(50)))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northEast()))
	)
	));
```

```kotlin
cloudinary.video {
	publicId("docs/mountain-aerial-view.mp4")
	 overlay(Overlay.source(
	Source.image("cloudinary_icon_blue") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(0.5F) })
	 adjust(Adjust.opacity(70))
	 adjust(Adjust.brightness() { level(50) }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northEast()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("docs/mountain-aerial-view", {transformation: [
  {overlay: new cloudinary.Layer().publicId("cloudinary_icon_blue")},
  {width: "0.5", crop: "scale"},
  {opacity: 70},
  {effect: "brightness:50"},
  {flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react_native
new CloudinaryVideo("docs/mountain-aerial-view.mp4").overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation()
        .resize(scale().width(0.5))
        .adjust(opacity(70))
        .adjust(brightness().level(50))
    )
  ).position(new Position().gravity(compass("north_east")))
);
```

2. The base image is scaled to a width of 500 pixels before adding an image overlay, where the overlay is automatically cropped to a 150px thumbnail including only the detected face and placed in the top left corner (`c_scale,w_500/l_docs:model/c_thumb,g_face,w_150/fl_layer_apply,g_north_west`):

    ![image with transformations applied to the overlay](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/l_docs:model/c_thumb,g_face,w_150/fl_layer_apply,g_north_west/docs/man-rocks-sea.jpg)

```nodejs
cloudinary.image("docs/man-rocks-sea.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: "docs:model"},
  {gravity: "face", width: 150, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_west"}
  ]})
```

```react
new CloudinaryImage("docs/man-rocks-sea.jpg")
  .resize(scale().width(500))
  .overlay(
    source(
      image("docs/model").transformation(
        new Transformation().resize(
          thumbnail().width(150).gravity(focusOn(face()))
        )
      )
    ).position(new Position().gravity(compass("north_west")))
  );
```

```vue
new CloudinaryImage("docs/man-rocks-sea.jpg")
  .resize(scale().width(500))
  .overlay(
    source(
      image("docs/model").transformation(
        new Transformation().resize(
          thumbnail().width(150).gravity(focusOn(face()))
        )
      )
    ).position(new Position().gravity(compass("north_west")))
  );
```

```angular
new CloudinaryImage("docs/man-rocks-sea.jpg")
  .resize(scale().width(500))
  .overlay(
    source(
      image("docs/model").transformation(
        new Transformation().resize(
          thumbnail().width(150).gravity(focusOn(face()))
        )
      )
    ).position(new Position().gravity(compass("north_west")))
  );
```

```js
new CloudinaryImage("docs/man-rocks-sea.jpg")
  .resize(scale().width(500))
  .overlay(
    source(
      image("docs/model").transformation(
        new Transformation().resize(
          thumbnail().width(150).gravity(focusOn(face()))
        )
      )
    ).position(new Position().gravity(compass("north_west")))
  );
```

```python
CloudinaryImage("docs/man-rocks-sea.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': "docs:model"},
  {'gravity': "face", 'width': 150, 'crop': "thumb"},
  {'flags': "layer_apply", 'gravity': "north_west"}
  ])
```

```php
(new ImageTag('docs/man-rocks-sea.jpg'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::image("docs/model")
	->transformation((new Transformation())
	->resize(Resize::thumbnail()->width(150)
	->gravity(
	Gravity::focusOn(
	FocusOn::face()))
	))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northWest()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new Layer().publicId("docs:model")).chain()
  .gravity("face").width(150).crop("thumb").chain()
  .flags("layer_apply").gravity("north_west")).imageTag("docs/man-rocks-sea.jpg");
```

```ruby
cl_image_tag("docs/man-rocks-sea.jpg", transformation: [
  {width: 500, crop: "scale"},
  {overlay: "docs:model"},
  {gravity: "face", width: 150, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_west"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new Layer().PublicId("docs:model")).Chain()
  .Gravity("face").Width(150).Crop("thumb").Chain()
  .Flags("layer_apply").Gravity("north_west")).BuildImageTag("docs/man-rocks-sea.jpg")
```

```dart
cloudinary.image('docs/man-rocks-sea.jpg').transformation(Transformation()
	.resize(Resize.scale().width(500))
	.overlay(Overlay.source(
	Source.image("docs/model")
	.transformation(new Transformation()
	.resize(Resize.thumbnail().width(150)
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northWest()))
	)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("docs:model").chain()
  .setGravity("face").setWidth(150).setCrop("thumb").chain()
  .setFlags("layer_apply").setGravity("north_west")).generate("docs/man-rocks-sea.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new Layer().publicId("docs:model")).chain()
  .gravity("face").width(150).crop("thumb").chain()
  .flags("layer_apply").gravity("north_west")).generate("docs/man-rocks-sea.jpg");
```

```flutter
cloudinary.image('docs/man-rocks-sea.jpg').transformation(Transformation()
	.resize(Resize.scale().width(500))
	.overlay(Overlay.source(
	Source.image("docs/model")
	.transformation(new Transformation()
	.resize(Resize.thumbnail().width(150)
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northWest()))
	)
	));
```

```kotlin
cloudinary.image {
	publicId("docs/man-rocks-sea.jpg")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.image("docs/model") {
	 transformation(Transformation {
	 resize(Resize.thumbnail() { width(150)
	 gravity(
	Gravity.focusOn(
	FocusOn.face()))
	 }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northWest()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("docs/man-rocks-sea.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.Layer().publicId("docs:model")},
  {gravity: "face", width: 150, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_west"}
  ]})
```

```react_native
new CloudinaryImage("docs/man-rocks-sea.jpg")
  .resize(scale().width(500))
  .overlay(
    source(
      image("docs/model").transformation(
        new Transformation().resize(
          thumbnail().width(150).gravity(focusOn(face()))
        )
      )
    ).position(new Position().gravity(compass("north_west")))
  );
```

    ![Video with transformations applied to the overlay](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/l_docs:model/c_thumb,g_face,w_150/fl_layer_apply,g_north_west/docs/campervan-by-lake.mp4)

```nodejs
cloudinary.video("docs/campervan-by-lake", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: "docs:model"},
  {gravity: "face", width: 150, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_west"}
  ]})
```

```react
new CloudinaryVideo("docs/campervan-by-lake.mp4")
  .resize(scale().width(500))
  .overlay(
    source(
      image("docs/model").transformation(
        new Transformation().resize(
          thumbnail().width(150).gravity(focusOn(face()))
        )
      )
    ).position(new Position().gravity(compass("north_west")))
  );
```

```vue
new CloudinaryVideo("docs/campervan-by-lake.mp4")
  .resize(scale().width(500))
  .overlay(
    source(
      image("docs/model").transformation(
        new Transformation().resize(
          thumbnail().width(150).gravity(focusOn(face()))
        )
      )
    ).position(new Position().gravity(compass("north_west")))
  );
```

```angular
new CloudinaryVideo("docs/campervan-by-lake.mp4")
  .resize(scale().width(500))
  .overlay(
    source(
      image("docs/model").transformation(
        new Transformation().resize(
          thumbnail().width(150).gravity(focusOn(face()))
        )
      )
    ).position(new Position().gravity(compass("north_west")))
  );
```

```js
new CloudinaryVideo("docs/campervan-by-lake.mp4")
  .resize(scale().width(500))
  .overlay(
    source(
      image("docs/model").transformation(
        new Transformation().resize(
          thumbnail().width(150).gravity(focusOn(face()))
        )
      )
    ).position(new Position().gravity(compass("north_west")))
  );
```

```python
CloudinaryVideo("docs/campervan-by-lake").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': "docs:model"},
  {'gravity': "face", 'width': 150, 'crop': "thumb"},
  {'flags': "layer_apply", 'gravity': "north_west"}
  ])
```

```php
(new VideoTag('docs/campervan-by-lake.mp4'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::image("docs/model")
	->transformation((new Transformation())
	->resize(Resize::thumbnail()->width(150)
	->gravity(
	Gravity::focusOn(
	FocusOn::face()))
	))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northWest()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new Layer().publicId("docs:model")).chain()
  .gravity("face").width(150).crop("thumb").chain()
  .flags("layer_apply").gravity("north_west")).videoTag("docs/campervan-by-lake");
```

```ruby
cl_video_tag("docs/campervan-by-lake", transformation: [
  {width: 500, crop: "scale"},
  {overlay: "docs:model"},
  {gravity: "face", width: 150, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_west"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new Layer().PublicId("docs:model")).Chain()
  .Gravity("face").Width(150).Crop("thumb").Chain()
  .Flags("layer_apply").Gravity("north_west")).BuildVideoTag("docs/campervan-by-lake")
```

```dart
cloudinary.video('docs/campervan-by-lake.mp4').transformation(Transformation()
	.resize(Resize.scale().width(500))
	.overlay(Overlay.source(
	Source.image("docs/model")
	.transformation(new Transformation()
	.resize(Resize.thumbnail().width(150)
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northWest()))
	)
	));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("docs:model").chain()
  .setGravity("face").setWidth(150).setCrop("thumb").chain()
  .setFlags("layer_apply").setGravity("north_west")).generate("docs/campervan-by-lake.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new Layer().publicId("docs:model")).chain()
  .gravity("face").width(150).crop("thumb").chain()
  .flags("layer_apply").gravity("north_west")).resourceType("video").generate("docs/campervan-by-lake.mp4");
```

```flutter
cloudinary.video('docs/campervan-by-lake.mp4').transformation(Transformation()
	.resize(Resize.scale().width(500))
	.overlay(Overlay.source(
	Source.image("docs/model")
	.transformation(new Transformation()
	.resize(Resize.thumbnail().width(150)
	.gravity(
	Gravity.focusOn(
	FocusOn.face()))
	))
	)
	.position(Position()
	.gravity(
	Gravity.compass(
	Compass.northWest()))
	)
	));
```

```kotlin
cloudinary.video {
	publicId("docs/campervan-by-lake.mp4")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.image("docs/model") {
	 transformation(Transformation {
	 resize(Resize.thumbnail() { width(150)
	 gravity(
	Gravity.focusOn(
	FocusOn.face()))
	 }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northWest()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("docs/campervan-by-lake", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.Layer().publicId("docs:model")},
  {gravity: "face", width: 150, crop: "thumb"},
  {flags: "layer_apply", gravity: "north_west"}
  ]})
```

```react_native
new CloudinaryVideo("docs/campervan-by-lake.mp4")
  .resize(scale().width(500))
  .overlay(
    source(
      image("docs/model").transformation(
        new Transformation().resize(
          thumbnail().width(150).gravity(focusOn(face()))
        )
      )
    ).position(new Position().gravity(compass("north_west")))
  );
```

> **NOTE**: You cannot use [object aware cropping](cloudinary_ai_content_analysis_addon#object_aware_cropping) in layers.
### Multiple overlays 

Multiple overlays can easily be added as chained transformations to an asset. The following example adds both image and text overlays to the base image as follows:

  1. An overlay of an image called `umbrella`, scaled to a 300px and place in the top left corner (`l_umbrella/c_scale,w_300/fl_layer_apply,g_north_west`).
  2. An overlay of an image called `cloudinary_icon_white` with a relative width of 50% of the base image and an opacity of 50% and a brightness of 100 (`l_cloudinary_icon_white/c_scale,fl_relative,w_0.5/o_50/e_brightness:100/fl_layer_apply`).
  3. The white text string "London" in bold 'Roboto' font with a size of 80 pixels, placed at a distance of 20 pixels from the bottom of the base image (`co_white,l_text:roboto_80_bold:London/fl_layer_apply,g_south,y_20`).

![Image with 3 overlays](https://res.cloudinary.com/demo/image/upload/w_1000/l_umbrella/c_scale,w_300/fl_layer_apply,g_north_west/l_cloudinary_icon_white/c_scale,fl_relative,w_0.5/o_50/e_brightness:100/fl_layer_apply/co_white,l_text:roboto_80_bold:London/fl_layer_apply,g_south,y_20/stroll-london-coat-bag.jpg "thumb: w_500")

```nodejs
cloudinary.image("stroll-london-coat-bag.jpg", {transformation: [
  {width: 1000, crop: "scale"},
  {overlay: "umbrella"},
  {width: 300, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west"},
  {overlay: "cloudinary_icon_white"},
  {flags: "relative", width: "0.5", crop: "scale"},
  {opacity: 50},
  {effect: "brightness:100"},
  {flags: "layer_apply"},
  {color: "white", overlay: {font_family: "roboto", font_size: 80, font_weight: "bold", text: "London"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react
new CloudinaryImage("stroll-london-coat-bag.jpg")
  .resize(scale().width(1000))
  .overlay(
    source(
      image("umbrella").transformation(
        new Transformation().resize(scale().width(300))
      )
    ).position(new Position().gravity(compass("north_west")))
  )
  .overlay(
    source(
      image("cloudinary_icon_white").transformation(
        new Transformation()
          .resize(scale().width(0.5).relative())
          .adjust(opacity(50))
          .adjust(brightness().level(100))
      )
    )
  )
  .overlay(
    source(
      text("London", new TextStyle("roboto", 80).fontWeight("bold")).textColor(
        "white"
      )
    ).position(
      new Position()
        .gravity(compass("south"))
        .offsetY(20)
    )
  );
```

```vue
new CloudinaryImage("stroll-london-coat-bag.jpg")
  .resize(scale().width(1000))
  .overlay(
    source(
      image("umbrella").transformation(
        new Transformation().resize(scale().width(300))
      )
    ).position(new Position().gravity(compass("north_west")))
  )
  .overlay(
    source(
      image("cloudinary_icon_white").transformation(
        new Transformation()
          .resize(scale().width(0.5).relative())
          .adjust(opacity(50))
          .adjust(brightness().level(100))
      )
    )
  )
  .overlay(
    source(
      text("London", new TextStyle("roboto", 80).fontWeight("bold")).textColor(
        "white"
      )
    ).position(
      new Position()
        .gravity(compass("south"))
        .offsetY(20)
    )
  );
```

```angular
new CloudinaryImage("stroll-london-coat-bag.jpg")
  .resize(scale().width(1000))
  .overlay(
    source(
      image("umbrella").transformation(
        new Transformation().resize(scale().width(300))
      )
    ).position(new Position().gravity(compass("north_west")))
  )
  .overlay(
    source(
      image("cloudinary_icon_white").transformation(
        new Transformation()
          .resize(scale().width(0.5).relative())
          .adjust(opacity(50))
          .adjust(brightness().level(100))
      )
    )
  )
  .overlay(
    source(
      text("London", new TextStyle("roboto", 80).fontWeight("bold")).textColor(
        "white"
      )
    ).position(
      new Position()
        .gravity(compass("south"))
        .offsetY(20)
    )
  );
```

```js
new CloudinaryImage("stroll-london-coat-bag.jpg")
  .resize(scale().width(1000))
  .overlay(
    source(
      image("umbrella").transformation(
        new Transformation().resize(scale().width(300))
      )
    ).position(new Position().gravity(compass("north_west")))
  )
  .overlay(
    source(
      image("cloudinary_icon_white").transformation(
        new Transformation()
          .resize(scale().width(0.5).relative())
          .adjust(opacity(50))
          .adjust(brightness().level(100))
      )
    )
  )
  .overlay(
    source(
      text("London", new TextStyle("roboto", 80).fontWeight("bold")).textColor(
        "white"
      )
    ).position(
      new Position()
        .gravity(compass("south"))
        .offsetY(20)
    )
  );
```

```python
CloudinaryImage("stroll-london-coat-bag.jpg").image(transformation=[
  {'width': 1000, 'crop': "scale"},
  {'overlay': "umbrella"},
  {'width': 300, 'crop': "scale"},
  {'flags': "layer_apply", 'gravity': "north_west"},
  {'overlay': "cloudinary_icon_white"},
  {'flags': "relative", 'width': "0.5", 'crop': "scale"},
  {'opacity': 50},
  {'effect': "brightness:100"},
  {'flags': "layer_apply"},
  {'color': "white", 'overlay': {'font_family': "roboto", 'font_size': 80, 'font_weight': "bold", 'text': "London"}},
  {'flags': "layer_apply", 'gravity': "south", 'y': 20}
  ])
```

```php
(new ImageTag('stroll-london-coat-bag.jpg'))
	->resize(Resize::scale()->width(1000))
	->overlay(Overlay::source(
	Source::image("umbrella")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(300)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northWest()))
	)
	)
	->overlay(Overlay::source(
	Source::image("cloudinary_icon_white")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(0.5)
	->relative()
	)
	->adjust(Adjust::opacity(50))
	->adjust(Adjust::brightness()->level(100)))
	))
	->overlay(Overlay::source(
	Source::text("London",(new TextStyle("roboto",80))
	->fontWeight(
	FontWeight::bold())
	)
	->textColor(Color::WHITE)
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::south()))
->offsetY(20))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(1000).crop("scale").chain()
  .overlay(new Layer().publicId("umbrella")).chain()
  .width(300).crop("scale").chain()
  .flags("layer_apply").gravity("north_west").chain()
  .overlay(new Layer().publicId("cloudinary_icon_white")).chain()
  .flags("relative").width(0.5).crop("scale").chain()
  .opacity(50).chain()
  .effect("brightness:100").chain()
  .flags("layer_apply").chain()
  .color("white").overlay(new TextLayer().fontFamily("roboto").fontSize(80).fontWeight("bold").text("London")).chain()
  .flags("layer_apply").gravity("south").y(20)).imageTag("stroll-london-coat-bag.jpg");
```

```ruby
cl_image_tag("stroll-london-coat-bag.jpg", transformation: [
  {width: 1000, crop: "scale"},
  {overlay: "umbrella"},
  {width: 300, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west"},
  {overlay: "cloudinary_icon_white"},
  {flags: "relative", width: 0.5, crop: "scale"},
  {opacity: 50},
  {effect: "brightness:100"},
  {flags: "layer_apply"},
  {color: "white", overlay: {font_family: "roboto", font_size: 80, font_weight: "bold", text: "London"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(1000).Crop("scale").Chain()
  .Overlay(new Layer().PublicId("umbrella")).Chain()
  .Width(300).Crop("scale").Chain()
  .Flags("layer_apply").Gravity("north_west").Chain()
  .Overlay(new Layer().PublicId("cloudinary_icon_white")).Chain()
  .Flags("relative").Width(0.5).Crop("scale").Chain()
  .Opacity(50).Chain()
  .Effect("brightness:100").Chain()
  .Flags("layer_apply").Chain()
  .Color("white").Overlay(new TextLayer().FontFamily("roboto").FontSize(80).FontWeight("bold").Text("London")).Chain()
  .Flags("layer_apply").Gravity("south").Y(20)).BuildImageTag("stroll-london-coat-bag.jpg")
```

```dart
cloudinary.image('stroll-london-coat-bag.jpg').transformation(Transformation()
	.addTransformation("w_1000/l_umbrella/c_scale,w_300/fl_layer_apply,g_north_west/l_cloudinary_icon_white/c_scale,fl_relative,w_0.5/o_50/e_brightness:100/fl_layer_apply/co_white,l_text:roboto_80_bold:London/fl_layer_apply,g_south,y_20"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(1000).setCrop("scale").chain()
  .setOverlay("umbrella").chain()
  .setWidth(300).setCrop("scale").chain()
  .setFlags("layer_apply").setGravity("north_west").chain()
  .setOverlay("cloudinary_icon_white").chain()
  .setFlags("relative").setWidth(0.5).setCrop("scale").chain()
  .setOpacity(50).chain()
  .setEffect("brightness:100").chain()
  .setFlags("layer_apply").chain()
  .setColor("white").setOverlay("text:roboto_80_bold:London").chain()
  .setFlags("layer_apply").setGravity("south").setY(20)).generate("stroll-london-coat-bag.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(1000).crop("scale").chain()
  .overlay(new Layer().publicId("umbrella")).chain()
  .width(300).crop("scale").chain()
  .flags("layer_apply").gravity("north_west").chain()
  .overlay(new Layer().publicId("cloudinary_icon_white")).chain()
  .flags("relative").width(0.5).crop("scale").chain()
  .opacity(50).chain()
  .effect("brightness:100").chain()
  .flags("layer_apply").chain()
  .color("white").overlay(new TextLayer().fontFamily("roboto").fontSize(80).fontWeight("bold").text("London")).chain()
  .flags("layer_apply").gravity("south").y(20)).generate("stroll-london-coat-bag.jpg");
```

```flutter
cloudinary.image('stroll-london-coat-bag.jpg').transformation(Transformation()
	.addTransformation("w_1000/l_umbrella/c_scale,w_300/fl_layer_apply,g_north_west/l_cloudinary_icon_white/c_scale,fl_relative,w_0.5/o_50/e_brightness:100/fl_layer_apply/co_white,l_text:roboto_80_bold:London/fl_layer_apply,g_south,y_20"));
```

```kotlin
cloudinary.image {
	publicId("stroll-london-coat-bag.jpg")
	 resize(Resize.scale() { width(1000) })
	 overlay(Overlay.source(
	Source.image("umbrella") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(300) }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northWest()))
	 })
	 })
	 overlay(Overlay.source(
	Source.image("cloudinary_icon_white") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(0.5F)
	 relative()
	 })
	 adjust(Adjust.opacity(50))
	 adjust(Adjust.brightness() { level(100) }) })
	 }))
	 overlay(Overlay.source(
	Source.text("London",TextStyle("roboto",80) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textColor(Color.WHITE)
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.south()))
 offsetY(20) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("stroll-london-coat-bag.jpg", {transformation: [
  {width: 1000, crop: "scale"},
  {overlay: new cloudinary.Layer().publicId("umbrella")},
  {width: 300, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west"},
  {overlay: new cloudinary.Layer().publicId("cloudinary_icon_white")},
  {flags: "relative", width: "0.5", crop: "scale"},
  {opacity: 50},
  {effect: "brightness:100"},
  {flags: "layer_apply"},
  {color: "white", overlay: new cloudinary.TextLayer().fontFamily("roboto").fontSize(80).fontWeight("bold").text("London")},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react_native
new CloudinaryImage("stroll-london-coat-bag.jpg")
  .resize(scale().width(1000))
  .overlay(
    source(
      image("umbrella").transformation(
        new Transformation().resize(scale().width(300))
      )
    ).position(new Position().gravity(compass("north_west")))
  )
  .overlay(
    source(
      image("cloudinary_icon_white").transformation(
        new Transformation()
          .resize(scale().width(0.5).relative())
          .adjust(opacity(50))
          .adjust(brightness().level(100))
      )
    )
  )
  .overlay(
    source(
      text("London", new TextStyle("roboto", 80).fontWeight("bold")).textColor(
        "white"
      )
    ).position(
      new Position()
        .gravity(compass("south"))
        .offsetY(20)
    )
  );
```

![Video with 3 overlays](https://res.cloudinary.com/demo/video/upload/w_1000/l_umbrella/c_scale,w_300/fl_layer_apply,g_north_west/l_cloudinary_icon_white/c_scale,fl_relative,w_0.5/o_50/e_brightness:100/fl_layer_apply/co_white,l_text:roboto_80_bold:London/fl_layer_apply,g_south,y_20/london_timelapse.mp4 "thumb: w_500")

```nodejs
cloudinary.video("london_timelapse", {transformation: [
  {width: 1000, crop: "scale"},
  {overlay: "umbrella"},
  {width: 300, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west"},
  {overlay: "cloudinary_icon_white"},
  {flags: "relative", width: "0.5", crop: "scale"},
  {opacity: 50},
  {effect: "brightness:100"},
  {flags: "layer_apply"},
  {color: "white", overlay: {font_family: "roboto", font_size: 80, font_weight: "bold", text: "London"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react
new CloudinaryVideo("london_timelapse.mp4")
  .resize(scale().width(1000))
  .overlay(
    source(
      image("umbrella").transformation(
        new Transformation().resize(scale().width(300))
      )
    ).position(new Position().gravity(compass("north_west")))
  )
  .overlay(
    source(
      image("cloudinary_icon_white").transformation(
        new Transformation()
          .resize(scale().width(0.5).relative())
          .adjust(opacity(50))
          .adjust(brightness().level(100))
      )
    )
  )
  .overlay(
    source(
      text("London", new TextStyle("roboto", 80).fontWeight("bold")).textColor(
        "white"
      )
    ).position(
      new Position()
        .gravity(compass("south"))
        .offsetY(20)
    )
  );
```

```vue
new CloudinaryVideo("london_timelapse.mp4")
  .resize(scale().width(1000))
  .overlay(
    source(
      image("umbrella").transformation(
        new Transformation().resize(scale().width(300))
      )
    ).position(new Position().gravity(compass("north_west")))
  )
  .overlay(
    source(
      image("cloudinary_icon_white").transformation(
        new Transformation()
          .resize(scale().width(0.5).relative())
          .adjust(opacity(50))
          .adjust(brightness().level(100))
      )
    )
  )
  .overlay(
    source(
      text("London", new TextStyle("roboto", 80).fontWeight("bold")).textColor(
        "white"
      )
    ).position(
      new Position()
        .gravity(compass("south"))
        .offsetY(20)
    )
  );
```

```angular
new CloudinaryVideo("london_timelapse.mp4")
  .resize(scale().width(1000))
  .overlay(
    source(
      image("umbrella").transformation(
        new Transformation().resize(scale().width(300))
      )
    ).position(new Position().gravity(compass("north_west")))
  )
  .overlay(
    source(
      image("cloudinary_icon_white").transformation(
        new Transformation()
          .resize(scale().width(0.5).relative())
          .adjust(opacity(50))
          .adjust(brightness().level(100))
      )
    )
  )
  .overlay(
    source(
      text("London", new TextStyle("roboto", 80).fontWeight("bold")).textColor(
        "white"
      )
    ).position(
      new Position()
        .gravity(compass("south"))
        .offsetY(20)
    )
  );
```

```js
new CloudinaryVideo("london_timelapse.mp4")
  .resize(scale().width(1000))
  .overlay(
    source(
      image("umbrella").transformation(
        new Transformation().resize(scale().width(300))
      )
    ).position(new Position().gravity(compass("north_west")))
  )
  .overlay(
    source(
      image("cloudinary_icon_white").transformation(
        new Transformation()
          .resize(scale().width(0.5).relative())
          .adjust(opacity(50))
          .adjust(brightness().level(100))
      )
    )
  )
  .overlay(
    source(
      text("London", new TextStyle("roboto", 80).fontWeight("bold")).textColor(
        "white"
      )
    ).position(
      new Position()
        .gravity(compass("south"))
        .offsetY(20)
    )
  );
```

```python
CloudinaryVideo("london_timelapse").video(transformation=[
  {'width': 1000, 'crop': "scale"},
  {'overlay': "umbrella"},
  {'width': 300, 'crop': "scale"},
  {'flags': "layer_apply", 'gravity': "north_west"},
  {'overlay': "cloudinary_icon_white"},
  {'flags': "relative", 'width': "0.5", 'crop': "scale"},
  {'opacity': 50},
  {'effect': "brightness:100"},
  {'flags': "layer_apply"},
  {'color': "white", 'overlay': {'font_family': "roboto", 'font_size': 80, 'font_weight': "bold", 'text': "London"}},
  {'flags': "layer_apply", 'gravity': "south", 'y': 20}
  ])
```

```php
(new VideoTag('london_timelapse.mp4'))
	->resize(Resize::scale()->width(1000))
	->overlay(Overlay::source(
	Source::image("umbrella")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(300)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northWest()))
	)
	)
	->overlay(Overlay::source(
	Source::image("cloudinary_icon_white")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(0.5)
	->relative()
	)
	->adjust(Adjust::opacity(50))
	->adjust(Adjust::brightness()->level(100)))
	))
	->overlay(Overlay::source(
	Source::text("London",(new TextStyle("roboto",80))
	->fontWeight(
	FontWeight::bold())
	)
	->textColor(Color::WHITE)
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::south()))
->offsetY(20))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(1000).crop("scale").chain()
  .overlay(new Layer().publicId("umbrella")).chain()
  .width(300).crop("scale").chain()
  .flags("layer_apply").gravity("north_west").chain()
  .overlay(new Layer().publicId("cloudinary_icon_white")).chain()
  .flags("relative").width(0.5).crop("scale").chain()
  .opacity(50).chain()
  .effect("brightness:100").chain()
  .flags("layer_apply").chain()
  .color("white").overlay(new TextLayer().fontFamily("roboto").fontSize(80).fontWeight("bold").text("London")).chain()
  .flags("layer_apply").gravity("south").y(20)).videoTag("london_timelapse");
```

```ruby
cl_video_tag("london_timelapse", transformation: [
  {width: 1000, crop: "scale"},
  {overlay: "umbrella"},
  {width: 300, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west"},
  {overlay: "cloudinary_icon_white"},
  {flags: "relative", width: 0.5, crop: "scale"},
  {opacity: 50},
  {effect: "brightness:100"},
  {flags: "layer_apply"},
  {color: "white", overlay: {font_family: "roboto", font_size: 80, font_weight: "bold", text: "London"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(1000).Crop("scale").Chain()
  .Overlay(new Layer().PublicId("umbrella")).Chain()
  .Width(300).Crop("scale").Chain()
  .Flags("layer_apply").Gravity("north_west").Chain()
  .Overlay(new Layer().PublicId("cloudinary_icon_white")).Chain()
  .Flags("relative").Width(0.5).Crop("scale").Chain()
  .Opacity(50).Chain()
  .Effect("brightness:100").Chain()
  .Flags("layer_apply").Chain()
  .Color("white").Overlay(new TextLayer().FontFamily("roboto").FontSize(80).FontWeight("bold").Text("London")).Chain()
  .Flags("layer_apply").Gravity("south").Y(20)).BuildVideoTag("london_timelapse")
```

```dart
cloudinary.video('london_timelapse.mp4').transformation(Transformation()
	.addTransformation("w_1000/l_umbrella/c_scale,w_300/fl_layer_apply,g_north_west/l_cloudinary_icon_white/c_scale,fl_relative,w_0.5/o_50/e_brightness:100/fl_layer_apply/co_white,l_text:roboto_80_bold:London/fl_layer_apply,g_south,y_20"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(1000).setCrop("scale").chain()
  .setOverlay("umbrella").chain()
  .setWidth(300).setCrop("scale").chain()
  .setFlags("layer_apply").setGravity("north_west").chain()
  .setOverlay("cloudinary_icon_white").chain()
  .setFlags("relative").setWidth(0.5).setCrop("scale").chain()
  .setOpacity(50).chain()
  .setEffect("brightness:100").chain()
  .setFlags("layer_apply").chain()
  .setColor("white").setOverlay("text:roboto_80_bold:London").chain()
  .setFlags("layer_apply").setGravity("south").setY(20)).generate("london_timelapse.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(1000).crop("scale").chain()
  .overlay(new Layer().publicId("umbrella")).chain()
  .width(300).crop("scale").chain()
  .flags("layer_apply").gravity("north_west").chain()
  .overlay(new Layer().publicId("cloudinary_icon_white")).chain()
  .flags("relative").width(0.5).crop("scale").chain()
  .opacity(50).chain()
  .effect("brightness:100").chain()
  .flags("layer_apply").chain()
  .color("white").overlay(new TextLayer().fontFamily("roboto").fontSize(80).fontWeight("bold").text("London")).chain()
  .flags("layer_apply").gravity("south").y(20)).resourceType("video").generate("london_timelapse.mp4");
```

```flutter
cloudinary.video('london_timelapse.mp4').transformation(Transformation()
	.addTransformation("w_1000/l_umbrella/c_scale,w_300/fl_layer_apply,g_north_west/l_cloudinary_icon_white/c_scale,fl_relative,w_0.5/o_50/e_brightness:100/fl_layer_apply/co_white,l_text:roboto_80_bold:London/fl_layer_apply,g_south,y_20"));
```

```kotlin
cloudinary.video {
	publicId("london_timelapse.mp4")
	 resize(Resize.scale() { width(1000) })
	 overlay(Overlay.source(
	Source.image("umbrella") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(300) }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northWest()))
	 })
	 })
	 overlay(Overlay.source(
	Source.image("cloudinary_icon_white") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(0.5F)
	 relative()
	 })
	 adjust(Adjust.opacity(50))
	 adjust(Adjust.brightness() { level(100) }) })
	 }))
	 overlay(Overlay.source(
	Source.text("London",TextStyle("roboto",80) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textColor(Color.WHITE)
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.south()))
 offsetY(20) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("london_timelapse", {transformation: [
  {width: 1000, crop: "scale"},
  {overlay: new cloudinary.Layer().publicId("umbrella")},
  {width: 300, crop: "scale"},
  {flags: "layer_apply", gravity: "north_west"},
  {overlay: new cloudinary.Layer().publicId("cloudinary_icon_white")},
  {flags: "relative", width: "0.5", crop: "scale"},
  {opacity: 50},
  {effect: "brightness:100"},
  {flags: "layer_apply"},
  {color: "white", overlay: new cloudinary.TextLayer().fontFamily("roboto").fontSize(80).fontWeight("bold").text("London")},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react_native
new CloudinaryVideo("london_timelapse.mp4")
  .resize(scale().width(1000))
  .overlay(
    source(
      image("umbrella").transformation(
        new Transformation().resize(scale().width(300))
      )
    ).position(new Position().gravity(compass("north_west")))
  )
  .overlay(
    source(
      image("cloudinary_icon_white").transformation(
        new Transformation()
          .resize(scale().width(0.5).relative())
          .adjust(opacity(50))
          .adjust(brightness().level(100))
      )
    )
  )
  .overlay(
    source(
      text("London", new TextStyle("roboto", 80).fontWeight("bold")).textColor(
        "white"
      )
    ).position(
      new Position()
        .gravity(compass("south"))
        .offsetY(20)
    )
  );
```
#### Nesting layers

Layers can be nested within layers. Each layer must have its own layer and `layer_apply` components, and the inner layer must be closed before the outer one, like with any nested programming statement.

For example, adding text to the moon overlay:

![image with nested layers](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/l_moon_layer/c_scale,w_150/l_text:roboto_20_bold:Moonlight/fl_layer_apply/fl_layer_apply,g_north_east/city_night_time.jpg)

```nodejs
cloudinary.image("city_night_time.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: "moon_layer"},
  {width: 150, crop: "scale"},
  {overlay: {font_family: "roboto", font_size: 20, font_weight: "bold", text: "Moonlight"}},
  {flags: "layer_apply"},
  {flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react
new CloudinaryImage("city_night_time.jpg")
  .resize(scale().width(500))
  .overlay(
    source(
      image("moon_layer").transformation(
        new Transformation()
          .resize(scale().width(150))
          .overlay(
            source(
              text("Moonlight", new TextStyle("roboto", 20).fontWeight("bold"))
            )
          )
      )
    ).position(new Position().gravity(compass("north_east")))
  );
```

```vue
new CloudinaryImage("city_night_time.jpg")
  .resize(scale().width(500))
  .overlay(
    source(
      image("moon_layer").transformation(
        new Transformation()
          .resize(scale().width(150))
          .overlay(
            source(
              text("Moonlight", new TextStyle("roboto", 20).fontWeight("bold"))
            )
          )
      )
    ).position(new Position().gravity(compass("north_east")))
  );
```

```angular
new CloudinaryImage("city_night_time.jpg")
  .resize(scale().width(500))
  .overlay(
    source(
      image("moon_layer").transformation(
        new Transformation()
          .resize(scale().width(150))
          .overlay(
            source(
              text("Moonlight", new TextStyle("roboto", 20).fontWeight("bold"))
            )
          )
      )
    ).position(new Position().gravity(compass("north_east")))
  );
```

```js
new CloudinaryImage("city_night_time.jpg")
  .resize(scale().width(500))
  .overlay(
    source(
      image("moon_layer").transformation(
        new Transformation()
          .resize(scale().width(150))
          .overlay(
            source(
              text("Moonlight", new TextStyle("roboto", 20).fontWeight("bold"))
            )
          )
      )
    ).position(new Position().gravity(compass("north_east")))
  );
```

```python
CloudinaryImage("city_night_time.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': "moon_layer"},
  {'width': 150, 'crop': "scale"},
  {'overlay': {'font_family': "roboto", 'font_size': 20, 'font_weight': "bold", 'text': "Moonlight"}},
  {'flags': "layer_apply"},
  {'flags': "layer_apply", 'gravity': "north_east"}
  ])
```

```php
(new ImageTag('city_night_time.jpg'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::image("moon_layer")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(150))
	->overlay(Overlay::source(
	Source::text("Moonlight",(new TextStyle("roboto",20))
	->fontWeight(
	FontWeight::bold())
	))))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northEast()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new Layer().publicId("moon_layer")).chain()
  .width(150).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("roboto").fontSize(20).fontWeight("bold").text("Moonlight")).chain()
  .flags("layer_apply").chain()
  .flags("layer_apply").gravity("north_east")).imageTag("city_night_time.jpg");
```

```ruby
cl_image_tag("city_night_time.jpg", transformation: [
  {width: 500, crop: "scale"},
  {overlay: "moon_layer"},
  {width: 150, crop: "scale"},
  {overlay: {font_family: "roboto", font_size: 20, font_weight: "bold", text: "Moonlight"}},
  {flags: "layer_apply"},
  {flags: "layer_apply", gravity: "north_east"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new Layer().PublicId("moon_layer")).Chain()
  .Width(150).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("roboto").FontSize(20).FontWeight("bold").Text("Moonlight")).Chain()
  .Flags("layer_apply").Chain()
  .Flags("layer_apply").Gravity("north_east")).BuildImageTag("city_night_time.jpg")
```

```dart
cloudinary.image('city_night_time.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_moon_layer/c_scale,w_150/l_text:roboto_20_bold:Moonlight/fl_layer_apply/fl_layer_apply,g_north_east"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("moon_layer").chain()
  .setWidth(150).setCrop("scale").chain()
  .setOverlay("text:roboto_20_bold:Moonlight").chain()
  .setFlags("layer_apply").chain()
  .setFlags("layer_apply").setGravity("north_east")).generate("city_night_time.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new Layer().publicId("moon_layer")).chain()
  .width(150).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("roboto").fontSize(20).fontWeight("bold").text("Moonlight")).chain()
  .flags("layer_apply").chain()
  .flags("layer_apply").gravity("north_east")).generate("city_night_time.jpg");
```

```flutter
cloudinary.image('city_night_time.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_moon_layer/c_scale,w_150/l_text:roboto_20_bold:Moonlight/fl_layer_apply/fl_layer_apply,g_north_east"));
```

```kotlin
cloudinary.image {
	publicId("city_night_time.jpg")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.image("moon_layer") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(150) })
	 overlay(Overlay.source(
	Source.text("Moonlight",TextStyle("roboto",20) {
	 fontWeight(
	FontWeight.bold())
	 }))) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northEast()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("city_night_time.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.Layer().publicId("moon_layer")},
  {width: 150, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("roboto").fontSize(20).fontWeight("bold").text("Moonlight")},
  {flags: "layer_apply"},
  {flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react_native
new CloudinaryImage("city_night_time.jpg")
  .resize(scale().width(500))
  .overlay(
    source(
      image("moon_layer").transformation(
        new Transformation()
          .resize(scale().width(150))
          .overlay(
            source(
              text("Moonlight", new TextStyle("roboto", 20).fontWeight("bold"))
            )
          )
      )
    ).position(new Position().gravity(compass("north_east")))
  );
```

![Video with nested layers](https://res.cloudinary.com/demo/video/upload/c_scale,h_500/l_moon_layer/c_scale,w_150/l_text:roboto_20_bold:Moonlight/fl_layer_apply/fl_layer_apply,g_north_east/night_drive.mp4)

```nodejs
cloudinary.video("night_drive", {transformation: [
  {height: 500, crop: "scale"},
  {overlay: "moon_layer"},
  {width: 150, crop: "scale"},
  {overlay: {font_family: "roboto", font_size: 20, font_weight: "bold", text: "Moonlight"}},
  {flags: "layer_apply"},
  {flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react
new CloudinaryVideo("night_drive.mp4")
  .resize(scale().height(500))
  .overlay(
    source(
      image("moon_layer").transformation(
        new Transformation()
          .resize(scale().width(150))
          .overlay(
            source(
              text("Moonlight", new TextStyle("roboto", 20).fontWeight("bold"))
            )
          )
      )
    ).position(new Position().gravity(compass("north_east")))
  );
```

```vue
new CloudinaryVideo("night_drive.mp4")
  .resize(scale().height(500))
  .overlay(
    source(
      image("moon_layer").transformation(
        new Transformation()
          .resize(scale().width(150))
          .overlay(
            source(
              text("Moonlight", new TextStyle("roboto", 20).fontWeight("bold"))
            )
          )
      )
    ).position(new Position().gravity(compass("north_east")))
  );
```

```angular
new CloudinaryVideo("night_drive.mp4")
  .resize(scale().height(500))
  .overlay(
    source(
      image("moon_layer").transformation(
        new Transformation()
          .resize(scale().width(150))
          .overlay(
            source(
              text("Moonlight", new TextStyle("roboto", 20).fontWeight("bold"))
            )
          )
      )
    ).position(new Position().gravity(compass("north_east")))
  );
```

```js
new CloudinaryVideo("night_drive.mp4")
  .resize(scale().height(500))
  .overlay(
    source(
      image("moon_layer").transformation(
        new Transformation()
          .resize(scale().width(150))
          .overlay(
            source(
              text("Moonlight", new TextStyle("roboto", 20).fontWeight("bold"))
            )
          )
      )
    ).position(new Position().gravity(compass("north_east")))
  );
```

```python
CloudinaryVideo("night_drive").video(transformation=[
  {'height': 500, 'crop': "scale"},
  {'overlay': "moon_layer"},
  {'width': 150, 'crop': "scale"},
  {'overlay': {'font_family': "roboto", 'font_size': 20, 'font_weight': "bold", 'text': "Moonlight"}},
  {'flags': "layer_apply"},
  {'flags': "layer_apply", 'gravity': "north_east"}
  ])
```

```php
(new VideoTag('night_drive.mp4'))
	->resize(Resize::scale()->height(500))
	->overlay(Overlay::source(
	Source::image("moon_layer")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(150))
	->overlay(Overlay::source(
	Source::text("Moonlight",(new TextStyle("roboto",20))
	->fontWeight(
	FontWeight::bold())
	))))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northEast()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .height(500).crop("scale").chain()
  .overlay(new Layer().publicId("moon_layer")).chain()
  .width(150).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("roboto").fontSize(20).fontWeight("bold").text("Moonlight")).chain()
  .flags("layer_apply").chain()
  .flags("layer_apply").gravity("north_east")).videoTag("night_drive");
```

```ruby
cl_video_tag("night_drive", transformation: [
  {height: 500, crop: "scale"},
  {overlay: "moon_layer"},
  {width: 150, crop: "scale"},
  {overlay: {font_family: "roboto", font_size: 20, font_weight: "bold", text: "Moonlight"}},
  {flags: "layer_apply"},
  {flags: "layer_apply", gravity: "north_east"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Height(500).Crop("scale").Chain()
  .Overlay(new Layer().PublicId("moon_layer")).Chain()
  .Width(150).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("roboto").FontSize(20).FontWeight("bold").Text("Moonlight")).Chain()
  .Flags("layer_apply").Chain()
  .Flags("layer_apply").Gravity("north_east")).BuildVideoTag("night_drive")
```

```dart
cloudinary.video('night_drive.mp4').transformation(Transformation()
	.addTransformation("c_scale,h_500/l_moon_layer/c_scale,w_150/l_text:roboto_20_bold:Moonlight/fl_layer_apply/fl_layer_apply,g_north_east"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setHeight(500).setCrop("scale").chain()
  .setOverlay("moon_layer").chain()
  .setWidth(150).setCrop("scale").chain()
  .setOverlay("text:roboto_20_bold:Moonlight").chain()
  .setFlags("layer_apply").chain()
  .setFlags("layer_apply").setGravity("north_east")).generate("night_drive.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .height(500).crop("scale").chain()
  .overlay(new Layer().publicId("moon_layer")).chain()
  .width(150).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("roboto").fontSize(20).fontWeight("bold").text("Moonlight")).chain()
  .flags("layer_apply").chain()
  .flags("layer_apply").gravity("north_east")).resourceType("video").generate("night_drive.mp4");
```

```flutter
cloudinary.video('night_drive.mp4').transformation(Transformation()
	.addTransformation("c_scale,h_500/l_moon_layer/c_scale,w_150/l_text:roboto_20_bold:Moonlight/fl_layer_apply/fl_layer_apply,g_north_east"));
```

```kotlin
cloudinary.video {
	publicId("night_drive.mp4")
	 resize(Resize.scale() { height(500) })
	 overlay(Overlay.source(
	Source.image("moon_layer") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(150) })
	 overlay(Overlay.source(
	Source.text("Moonlight",TextStyle("roboto",20) {
	 fontWeight(
	FontWeight.bold())
	 }))) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northEast()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("night_drive", {transformation: [
  {height: 500, crop: "scale"},
  {overlay: new cloudinary.Layer().publicId("moon_layer")},
  {width: 150, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("roboto").fontSize(20).fontWeight("bold").text("Moonlight")},
  {flags: "layer_apply"},
  {flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react_native
new CloudinaryVideo("night_drive.mp4")
  .resize(scale().height(500))
  .overlay(
    source(
      image("moon_layer").transformation(
        new Transformation()
          .resize(scale().width(150))
          .overlay(
            source(
              text("Moonlight", new TextStyle("roboto", 20).fontWeight("bold"))
            )
          )
      )
    ).position(new Position().gravity(compass("north_east")))
  );
```

The first image layer has a transformation that changes its size and the second layer is a text layer configured with a font and size. The second layer is closed and placed by the first (inner) `fl_layer_apply`. Since no gravity was specified for that later, it's placed in the center of the first overlay. Then the outer layer apply closes and places the entire layer (including its nested layer) and positions it in the northeast corner.
### Relative layer sizing

By default, whenever you apply relative resize [transformations to your overlay](#layer_transformations), the overlay image is resized relative to its own original size. However, you can use one of the following flags to resize relative to other elements.

#### Sizing relative to the base image

You can add the `relative` flag (`fl_relative` in URLs) to specify that percentage-based width & height parameters of overlays (e.g., w\_0.5) are relative to the size of the base image instead of to the original size of the overlaying image itself. 

For example, to add an overlay of the image called `stamp-exclusive-premium`, where the overlay is resized to 70% of the width of the base image (`l_stamp-exclusive-premium/c_scale,fl_relative,w_0.7/fl_layer_apply`):

![Image with overlay resized relative to base image](https://res.cloudinary.com/demo/image/upload/l_stamp-exclusive-premium/c_scale,fl_relative,w_0.7/fl_layer_apply/docs/car-2596344_1280.jpg "thumb: w_400")

```nodejs
cloudinary.image("docs/car-2596344_1280.jpg", {transformation: [
  {overlay: "stamp-exclusive-premium"},
  {flags: "relative", width: "0.7", crop: "scale"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryImage("docs/car-2596344_1280.jpg").overlay(
  source(
    image("stamp-exclusive-premium").transformation(
      new Transformation().resize(scale().width(0.7).relative())
    )
  )
);
```

```vue
new CloudinaryImage("docs/car-2596344_1280.jpg").overlay(
  source(
    image("stamp-exclusive-premium").transformation(
      new Transformation().resize(scale().width(0.7).relative())
    )
  )
);
```

```angular
new CloudinaryImage("docs/car-2596344_1280.jpg").overlay(
  source(
    image("stamp-exclusive-premium").transformation(
      new Transformation().resize(scale().width(0.7).relative())
    )
  )
);
```

```js
new CloudinaryImage("docs/car-2596344_1280.jpg").overlay(
  source(
    image("stamp-exclusive-premium").transformation(
      new Transformation().resize(scale().width(0.7).relative())
    )
  )
);
```

```python
CloudinaryImage("docs/car-2596344_1280.jpg").image(transformation=[
  {'overlay': "stamp-exclusive-premium"},
  {'flags': "relative", 'width': "0.7", 'crop': "scale"},
  {'flags': "layer_apply"}
  ])
```

```php
(new ImageTag('docs/car-2596344_1280.jpg'))
	->overlay(Overlay::source(
	Source::image("stamp-exclusive-premium")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(0.7)
	->relative()
	))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("stamp-exclusive-premium")).chain()
  .flags("relative").width(0.7).crop("scale").chain()
  .flags("layer_apply")).imageTag("docs/car-2596344_1280.jpg");
```

```ruby
cl_image_tag("docs/car-2596344_1280.jpg", transformation: [
  {overlay: "stamp-exclusive-premium"},
  {flags: "relative", width: 0.7, crop: "scale"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("stamp-exclusive-premium")).Chain()
  .Flags("relative").Width(0.7).Crop("scale").Chain()
  .Flags("layer_apply")).BuildImageTag("docs/car-2596344_1280.jpg")
```

```dart
cloudinary.image('docs/car-2596344_1280.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("stamp-exclusive-premium")
	.transformation(new Transformation()
	.resize(Resize.scale().width(0.7)
	.relative()
	))
	)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("stamp-exclusive-premium").chain()
  .setFlags("relative").setWidth(0.7).setCrop("scale").chain()
  .setFlags("layer_apply")).generate("docs/car-2596344_1280.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("stamp-exclusive-premium")).chain()
  .flags("relative").width(0.7).crop("scale").chain()
  .flags("layer_apply")).generate("docs/car-2596344_1280.jpg");
```

```flutter
cloudinary.image('docs/car-2596344_1280.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("stamp-exclusive-premium")
	.transformation(new Transformation()
	.resize(Resize.scale().width(0.7)
	.relative()
	))
	)));
```

```kotlin
cloudinary.image {
	publicId("docs/car-2596344_1280.jpg")
	 overlay(Overlay.source(
	Source.image("stamp-exclusive-premium") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(0.7F)
	 relative()
	 }) })
	 })) 
}.generate()
```

```jquery
$.cloudinary.image("docs/car-2596344_1280.jpg", {transformation: [
  {overlay: new cloudinary.Layer().publicId("stamp-exclusive-premium")},
  {flags: "relative", width: "0.7", crop: "scale"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryImage("docs/car-2596344_1280.jpg").overlay(
  source(
    image("stamp-exclusive-premium").transformation(
      new Transformation().resize(scale().width(0.7).relative())
    )
  )
);
```

#### Sizing relative to the detected region

You can add the `region_relative` flag (`fl_region_relative` in URLs) to instruct Cloudinary to size your layers relative to the regions detected by the specified gravity type. 

* The region can be detected faces (`g_face`, `g_faces` ), detected OCR text regions (`g_ocr_text`) or pre-defined custom regions (`g_custom`). 
* This flag must be used in conjunction with a relative (decimal value) width or height qualifier. 

For example, to hide all the faces in an image by covering them with an emoji overlay, where each overlay is sized at 1.3x (130%) of each detected face (`l_happy_smiley/c_scale,fl_region_relative,w_1.3/fl_layer_apply,g_faces`):

![Hide faces in an image with emojis](https://res.cloudinary.com/demo/image/upload/l_happy_smiley/c_scale,fl_region_relative,w_1.3/fl_layer_apply,g_faces/rollercoaster.jpg "thumb: w_400")

```nodejs
cloudinary.image("rollercoaster.jpg", {transformation: [
  {overlay: "happy_smiley"},
  {flags: "region_relative", width: "1.3", crop: "scale"},
  {flags: "layer_apply", gravity: "faces"}
  ]})
```

```react
new CloudinaryImage("rollercoaster.jpg").overlay(
  source(
    image("happy_smiley").transformation(
      new Transformation().resize(scale().width(1.3).regionRelative())
    )
  ).position(new Position().gravity(focusOn(faces())))
);
```

```vue
new CloudinaryImage("rollercoaster.jpg").overlay(
  source(
    image("happy_smiley").transformation(
      new Transformation().resize(scale().width(1.3).regionRelative())
    )
  ).position(new Position().gravity(focusOn(faces())))
);
```

```angular
new CloudinaryImage("rollercoaster.jpg").overlay(
  source(
    image("happy_smiley").transformation(
      new Transformation().resize(scale().width(1.3).regionRelative())
    )
  ).position(new Position().gravity(focusOn(faces())))
);
```

```js
new CloudinaryImage("rollercoaster.jpg").overlay(
  source(
    image("happy_smiley").transformation(
      new Transformation().resize(scale().width(1.3).regionRelative())
    )
  ).position(new Position().gravity(focusOn(faces())))
);
```

```python
CloudinaryImage("rollercoaster.jpg").image(transformation=[
  {'overlay': "happy_smiley"},
  {'flags': "region_relative", 'width': "1.3", 'crop': "scale"},
  {'flags': "layer_apply", 'gravity': "faces"}
  ])
```

```php
(new ImageTag('rollercoaster.jpg'))
	->overlay(Overlay::source(
	Source::image("happy_smiley")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(1.3)
	->regionRelative()
	))
	)
	->position((new Position())
	->gravity(
	Gravity::focusOn(
	FocusOn::faces()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("happy_smiley")).chain()
  .flags("region_relative").width(1.3).crop("scale").chain()
  .flags("layer_apply").gravity("faces")).imageTag("rollercoaster.jpg");
```

```ruby
cl_image_tag("rollercoaster.jpg", transformation: [
  {overlay: "happy_smiley"},
  {flags: "region_relative", width: 1.3, crop: "scale"},
  {flags: "layer_apply", gravity: "faces"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("happy_smiley")).Chain()
  .Flags("region_relative").Width(1.3).Crop("scale").Chain()
  .Flags("layer_apply").Gravity("faces")).BuildImageTag("rollercoaster.jpg")
```

```dart
cloudinary.image('rollercoaster.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("happy_smiley")
	.transformation(new Transformation()
	.resize(Resize.scale().width(1.3)
	.regionRelative()
	))
	)
	.position(Position()
	.gravity(
	Gravity.focusOn(
	FocusOn.faces()))
	)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("happy_smiley").chain()
  .setFlags("region_relative").setWidth(1.3).setCrop("scale").chain()
  .setFlags("layer_apply").setGravity("faces")).generate("rollercoaster.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("happy_smiley")).chain()
  .flags("region_relative").width(1.3).crop("scale").chain()
  .flags("layer_apply").gravity("faces")).generate("rollercoaster.jpg");
```

```flutter
cloudinary.image('rollercoaster.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("happy_smiley")
	.transformation(new Transformation()
	.resize(Resize.scale().width(1.3)
	.regionRelative()
	))
	)
	.position(Position()
	.gravity(
	Gravity.focusOn(
	FocusOn.faces()))
	)
	));
```

```kotlin
cloudinary.image {
	publicId("rollercoaster.jpg")
	 overlay(Overlay.source(
	Source.image("happy_smiley") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(1.3F)
	 regionRelative()
	 }) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.focusOn(
	FocusOn.faces()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("rollercoaster.jpg", {transformation: [
  {overlay: new cloudinary.Layer().publicId("happy_smiley")},
  {flags: "region_relative", width: "1.3", crop: "scale"},
  {flags: "layer_apply", gravity: "faces"}
  ]})
```

```react_native
new CloudinaryImage("rollercoaster.jpg").overlay(
  source(
    image("happy_smiley").transformation(
      new Transformation().resize(scale().width(1.3).regionRelative())
    )
  ).position(new Position().gravity(focusOn(faces())))
);
```

## Text layer options

Text layers can be customized in a variety of ways, such as applying CSS-like styles, adding line breaks, applying special characters, custom fonts, and more.

### Styling parameters

In addition to the **required** font family and font size values of the text layer, a variety of optional CSS-like styles are supported, such as decoration, alignment, letter spacing, line spacing and more. For a full list, see the [Styling parameters](transformation_reference#styling_parameters) table in the _Transformation Reference_.

The Cloudinary SDK [helper methods](image_transformations#embedding_images_in_web_pages) support supplying the values as an array of mapped values or as a serialized string of values. For example, in Ruby (other frameworks use similar syntax):
`overlay: { text: 'Hello World',  font_family: 'Arial', font_size: 18, font_weight: 'bold', font_style: 'italic', letter_spacing: 4 }`

For example, to overlay the text string "Style" in Verdana bold with a size of 75 pixels, underlined, and with 14 pixels spacing between the letters: `l_text:Verdana_50_bold_underline_letter_spacing_14:Style`:

![Adding text to image](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/l_text:Verdana_75_bold_underline_letter_spacing_14:Style/fl_layer_apply/alfa_car.jpg)

```nodejs
cloudinary.image("alfa_car.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Verdana", font_size: 75, font_weight: "bold", text_decoration: "underline", letter_spacing: 14, text: "Style"}},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text(
      "Style",
      new TextStyle("Verdana", 75)
        .fontWeight("bold")
        .textDecoration("underline")
        .letterSpacing(14)
    )
  )
);
```

```vue
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text(
      "Style",
      new TextStyle("Verdana", 75)
        .fontWeight("bold")
        .textDecoration("underline")
        .letterSpacing(14)
    )
  )
);
```

```angular
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text(
      "Style",
      new TextStyle("Verdana", 75)
        .fontWeight("bold")
        .textDecoration("underline")
        .letterSpacing(14)
    )
  )
);
```

```js
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text(
      "Style",
      new TextStyle("Verdana", 75)
        .fontWeight("bold")
        .textDecoration("underline")
        .letterSpacing(14)
    )
  )
);
```

```python
CloudinaryImage("alfa_car.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'font_family': "Verdana", 'font_size': 75, 'font_weight': "bold", 'text_decoration': "underline", 'letter_spacing': 14, 'text': "Style"}},
  {'flags': "layer_apply"}
  ])
```

```php
(new ImageTag('alfa_car.jpg'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Style",(new TextStyle("Verdana",75))
	->fontWeight(
	FontWeight::bold())
	->textDecoration(
	TextDecoration::underline())
->letterSpacing(14))));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Verdana").fontSize(75).fontWeight("bold").textDecoration("underline").letterSpacing(14).text("Style")).chain()
  .flags("layer_apply")).imageTag("alfa_car.jpg");
```

```ruby
cl_image_tag("alfa_car.jpg", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Verdana", font_size: 75, font_weight: "bold", text_decoration: "underline", letter_spacing: 14, text: "Style"}},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("Verdana").FontSize(75).FontWeight("bold").TextDecoration("underline").LetterSpacing(14).Text("Style")).Chain()
  .Flags("layer_apply")).BuildImageTag("alfa_car.jpg")
```

```dart
cloudinary.image('alfa_car.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_text:Verdana_75_bold_underline_letter_spacing_14:Style/fl_layer_apply"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:Verdana_75_bold_underline_letter_spacing_14:Style").chain()
  .setFlags("layer_apply")).generate("alfa_car.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Verdana").fontSize(75).fontWeight("bold").textDecoration("underline").letterSpacing(14).text("Style")).chain()
  .flags("layer_apply")).generate("alfa_car.jpg");
```

```flutter
cloudinary.image('alfa_car.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_text:Verdana_75_bold_underline_letter_spacing_14:Style/fl_layer_apply"));
```

```kotlin
cloudinary.image {
	publicId("alfa_car.jpg")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Style",TextStyle("Verdana",75) {
	 fontWeight(
	FontWeight.bold())
	 textDecoration(
	TextDecoration.underline())
 letterSpacing(14) }))) 
}.generate()
```

```jquery
$.cloudinary.image("alfa_car.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("Verdana").fontSize(75).fontWeight("bold").textDecoration("underline").letterSpacing(14).text("Style")},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text(
      "Style",
      new TextStyle("Verdana", 75)
        .fontWeight("bold")
        .textDecoration("underline")
        .letterSpacing(14)
    )
  )
);
```

![Adding text to video](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/l_text:Verdana_50_bold_underline_letter_spacing_14:Style/fl_layer_apply/blue_sports_car.mp4)

```nodejs
cloudinary.video("blue_sports_car", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Verdana", font_size: 50, font_weight: "bold", text_decoration: "underline", letter_spacing: 14, text: "Style"}},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text(
      "Style",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .textDecoration("underline")
        .letterSpacing(14)
    )
  )
);
```

```vue
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text(
      "Style",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .textDecoration("underline")
        .letterSpacing(14)
    )
  )
);
```

```angular
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text(
      "Style",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .textDecoration("underline")
        .letterSpacing(14)
    )
  )
);
```

```js
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text(
      "Style",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .textDecoration("underline")
        .letterSpacing(14)
    )
  )
);
```

```python
CloudinaryVideo("blue_sports_car").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'font_family': "Verdana", 'font_size': 50, 'font_weight': "bold", 'text_decoration': "underline", 'letter_spacing': 14, 'text': "Style"}},
  {'flags': "layer_apply"}
  ])
```

```php
(new VideoTag('blue_sports_car.mp4'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Style",(new TextStyle("Verdana",50))
	->fontWeight(
	FontWeight::bold())
	->textDecoration(
	TextDecoration::underline())
->letterSpacing(14))));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Verdana").fontSize(50).fontWeight("bold").textDecoration("underline").letterSpacing(14).text("Style")).chain()
  .flags("layer_apply")).videoTag("blue_sports_car");
```

```ruby
cl_video_tag("blue_sports_car", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Verdana", font_size: 50, font_weight: "bold", text_decoration: "underline", letter_spacing: 14, text: "Style"}},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("Verdana").FontSize(50).FontWeight("bold").TextDecoration("underline").LetterSpacing(14).Text("Style")).Chain()
  .Flags("layer_apply")).BuildVideoTag("blue_sports_car")
```

```dart
cloudinary.video('blue_sports_car.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_text:Verdana_50_bold_underline_letter_spacing_14:Style/fl_layer_apply"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:Verdana_50_bold_underline_letter_spacing_14:Style").chain()
  .setFlags("layer_apply")).generate("blue_sports_car.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Verdana").fontSize(50).fontWeight("bold").textDecoration("underline").letterSpacing(14).text("Style")).chain()
  .flags("layer_apply")).resourceType("video").generate("blue_sports_car.mp4");
```

```flutter
cloudinary.video('blue_sports_car.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_text:Verdana_50_bold_underline_letter_spacing_14:Style/fl_layer_apply"));
```

```kotlin
cloudinary.video {
	publicId("blue_sports_car.mp4")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Style",TextStyle("Verdana",50) {
	 fontWeight(
	FontWeight.bold())
	 textDecoration(
	TextDecoration.underline())
 letterSpacing(14) }))) 
}.generate()
```

```jquery
$.cloudinary.video("blue_sports_car", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("Verdana").fontSize(50).fontWeight("bold").textDecoration("underline").letterSpacing(14).text("Style")},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text(
      "Style",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .textDecoration("underline")
        .letterSpacing(14)
    )
  )
);
```

> **TIP**: You can save styling parameters as a text image for easy reuse. See [Predefined text templates](#predefined_text_templates).

### Text color 

You can control the color of the text overlay by adding the `color` property (`co` in URLs). 

Opaque colors can be set as an RGB hex triplet (e.g., `co_rgb:3e2222`), a 3-digit RGB hex (e.g., `co_rgb:777`) or a named color (e.g., `co_green`). By default, if the color property is omitted, the text has a black color.

For example, adding the text string "Style" in Times bold with a size of 90 pixels at a distance of 20 pixels from the bottom of the base image, in yellow text (FFFF00):  

!['Style' added to image](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/co_rgb:FFFF00,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20/alfa_car.jpg)

```nodejs
cloudinary.image("alfa_car.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF00", overlay: {font_family: "Times", font_size: 90, font_weight: "bold", text: "Style"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF00"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```vue
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF00"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```angular
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF00"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```js
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF00"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```python
CloudinaryImage("alfa_car.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'color': "#FFFF00", 'overlay': {'font_family': "Times", 'font_size': 90, 'font_weight': "bold", 'text': "Style"}},
  {'flags': "layer_apply", 'gravity': "south", 'y': 20}
  ])
```

```php
(new ImageTag('alfa_car.jpg'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Style",(new TextStyle("Times",90))
	->fontWeight(
	FontWeight::bold())
	)
	->textColor(Color::rgb("FFFF00"))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::south()))
->offsetY(20))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .color("#FFFF00").overlay(new TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")).chain()
  .flags("layer_apply").gravity("south").y(20)).imageTag("alfa_car.jpg");
```

```ruby
cl_image_tag("alfa_car.jpg", transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF00", overlay: {font_family: "Times", font_size: 90, font_weight: "bold", text: "Style"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Color("#FFFF00").Overlay(new TextLayer().FontFamily("Times").FontSize(90).FontWeight("bold").Text("Style")).Chain()
  .Flags("layer_apply").Gravity("south").Y(20)).BuildImageTag("alfa_car.jpg")
```

```dart
cloudinary.image('alfa_car.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/co_rgb:FFFF00,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setColor("#FFFF00").setOverlay("text:Times_90_bold:Style").chain()
  .setFlags("layer_apply").setGravity("south").setY(20)).generate("alfa_car.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .color("#FFFF00").overlay(new TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")).chain()
  .flags("layer_apply").gravity("south").y(20)).generate("alfa_car.jpg");
```

```flutter
cloudinary.image('alfa_car.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/co_rgb:FFFF00,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20"));
```

```kotlin
cloudinary.image {
	publicId("alfa_car.jpg")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Style",TextStyle("Times",90) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textColor(Color.rgb("FFFF00"))
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.south()))
 offsetY(20) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("alfa_car.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF00", overlay: new cloudinary.TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react_native
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF00"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

!['Style' added to video](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/co_rgb:FFFF00,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20/blue_sports_car.mp4)

```nodejs
cloudinary.video("blue_sports_car", {transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF00", overlay: {font_family: "Times", font_size: 90, font_weight: "bold", text: "Style"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF00"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```vue
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF00"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```angular
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF00"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```js
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF00"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```python
CloudinaryVideo("blue_sports_car").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'color': "#FFFF00", 'overlay': {'font_family': "Times", 'font_size': 90, 'font_weight': "bold", 'text': "Style"}},
  {'flags': "layer_apply", 'gravity': "south", 'y': 20}
  ])
```

```php
(new VideoTag('blue_sports_car.mp4'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Style",(new TextStyle("Times",90))
	->fontWeight(
	FontWeight::bold())
	)
	->textColor(Color::rgb("FFFF00"))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::south()))
->offsetY(20))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .color("#FFFF00").overlay(new TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")).chain()
  .flags("layer_apply").gravity("south").y(20)).videoTag("blue_sports_car");
```

```ruby
cl_video_tag("blue_sports_car", transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF00", overlay: {font_family: "Times", font_size: 90, font_weight: "bold", text: "Style"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Color("#FFFF00").Overlay(new TextLayer().FontFamily("Times").FontSize(90).FontWeight("bold").Text("Style")).Chain()
  .Flags("layer_apply").Gravity("south").Y(20)).BuildVideoTag("blue_sports_car")
```

```dart
cloudinary.video('blue_sports_car.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/co_rgb:FFFF00,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setColor("#FFFF00").setOverlay("text:Times_90_bold:Style").chain()
  .setFlags("layer_apply").setGravity("south").setY(20)).generate("blue_sports_car.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .color("#FFFF00").overlay(new TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")).chain()
  .flags("layer_apply").gravity("south").y(20)).resourceType("video").generate("blue_sports_car.mp4");
```

```flutter
cloudinary.video('blue_sports_car.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/co_rgb:FFFF00,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20"));
```

```kotlin
cloudinary.video {
	publicId("blue_sports_car.mp4")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Style",TextStyle("Times",90) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textColor(Color.rgb("FFFF00"))
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.south()))
 offsetY(20) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("blue_sports_car", {transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF00", overlay: new cloudinary.TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react_native
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF00"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

You can also use a 4-digit or 8-digit RGBA hex quadruplet for the color, where the 4th hex value represents the alpha (opacity) value (e.g., `co_rgb:3e222240` results in 25% opacity). 

The example below uses the same text string "Style" in Times bold with a size of 90 pixels at a distance of 20 pixels from the bottom of the base image, in yellow text, but this time with an opacity of 50% (FFFF0080):  

![Semi-transparent 'Style' added to image](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/co_rgb:FFFF0080,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20/alfa_car.jpg)

```nodejs
cloudinary.image("alfa_car.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF0080", overlay: {font_family: "Times", font_size: 90, font_weight: "bold", text: "Style"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF0080"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```vue
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF0080"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```angular
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF0080"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```js
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF0080"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```python
CloudinaryImage("alfa_car.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'color': "#FFFF0080", 'overlay': {'font_family': "Times", 'font_size': 90, 'font_weight': "bold", 'text': "Style"}},
  {'flags': "layer_apply", 'gravity': "south", 'y': 20}
  ])
```

```php
(new ImageTag('alfa_car.jpg'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Style",(new TextStyle("Times",90))
	->fontWeight(
	FontWeight::bold())
	)
	->textColor(Color::rgb("FFFF0080"))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::south()))
->offsetY(20))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .color("#FFFF0080").overlay(new TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")).chain()
  .flags("layer_apply").gravity("south").y(20)).imageTag("alfa_car.jpg");
```

```ruby
cl_image_tag("alfa_car.jpg", transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF0080", overlay: {font_family: "Times", font_size: 90, font_weight: "bold", text: "Style"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Color("#FFFF0080").Overlay(new TextLayer().FontFamily("Times").FontSize(90).FontWeight("bold").Text("Style")).Chain()
  .Flags("layer_apply").Gravity("south").Y(20)).BuildImageTag("alfa_car.jpg")
```

```dart
cloudinary.image('alfa_car.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/co_rgb:FFFF0080,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setColor("#FFFF0080").setOverlay("text:Times_90_bold:Style").chain()
  .setFlags("layer_apply").setGravity("south").setY(20)).generate("alfa_car.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .color("#FFFF0080").overlay(new TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")).chain()
  .flags("layer_apply").gravity("south").y(20)).generate("alfa_car.jpg");
```

```flutter
cloudinary.image('alfa_car.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/co_rgb:FFFF0080,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20"));
```

```kotlin
cloudinary.image {
	publicId("alfa_car.jpg")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Style",TextStyle("Times",90) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textColor(Color.rgb("FFFF0080"))
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.south()))
 offsetY(20) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("alfa_car.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF0080", overlay: new cloudinary.TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react_native
new CloudinaryImage("alfa_car.jpg").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF0080"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

![Semi-transparent 'Style' added to video](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/co_rgb:FFFF0080,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20/blue_sports_car.mp4)

```nodejs
cloudinary.video("blue_sports_car", {transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF0080", overlay: {font_family: "Times", font_size: 90, font_weight: "bold", text: "Style"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF0080"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```vue
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF0080"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```angular
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF0080"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```js
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF0080"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

```python
CloudinaryVideo("blue_sports_car").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'color': "#FFFF0080", 'overlay': {'font_family': "Times", 'font_size': 90, 'font_weight': "bold", 'text': "Style"}},
  {'flags': "layer_apply", 'gravity': "south", 'y': 20}
  ])
```

```php
(new VideoTag('blue_sports_car.mp4'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Style",(new TextStyle("Times",90))
	->fontWeight(
	FontWeight::bold())
	)
	->textColor(Color::rgb("FFFF0080"))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::south()))
->offsetY(20))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .color("#FFFF0080").overlay(new TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")).chain()
  .flags("layer_apply").gravity("south").y(20)).videoTag("blue_sports_car");
```

```ruby
cl_video_tag("blue_sports_car", transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF0080", overlay: {font_family: "Times", font_size: 90, font_weight: "bold", text: "Style"}},
  {flags: "layer_apply", gravity: "south", y: 20}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Color("#FFFF0080").Overlay(new TextLayer().FontFamily("Times").FontSize(90).FontWeight("bold").Text("Style")).Chain()
  .Flags("layer_apply").Gravity("south").Y(20)).BuildVideoTag("blue_sports_car")
```

```dart
cloudinary.video('blue_sports_car.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/co_rgb:FFFF0080,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setColor("#FFFF0080").setOverlay("text:Times_90_bold:Style").chain()
  .setFlags("layer_apply").setGravity("south").setY(20)).generate("blue_sports_car.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .color("#FFFF0080").overlay(new TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")).chain()
  .flags("layer_apply").gravity("south").y(20)).resourceType("video").generate("blue_sports_car.mp4");
```

```flutter
cloudinary.video('blue_sports_car.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/co_rgb:FFFF0080,l_text:Times_90_bold:Style/fl_layer_apply,g_south,y_20"));
```

```kotlin
cloudinary.video {
	publicId("blue_sports_car.mp4")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Style",TextStyle("Times",90) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textColor(Color.rgb("FFFF0080"))
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.south()))
 offsetY(20) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("blue_sports_car", {transformation: [
  {width: 500, crop: "scale"},
  {color: "#FFFF0080", overlay: new cloudinary.TextLayer().fontFamily("Times").fontSize(90).fontWeight("bold").text("Style")},
  {flags: "layer_apply", gravity: "south", y: 20}
  ]})
```

```react_native
new CloudinaryVideo("blue_sports_car.mp4").resize(scale().width(500)).overlay(
  source(
    text("Style", new TextStyle("Times", 90).fontWeight("bold")).textColor(
      "#FFFF0080"
    )
  ).position(
    new Position()
      .gravity(compass("south"))
      .offsetY(20)
  )
);
```

### Multi-line text

You can manually break lines of text by separating each line of text with the newline character (%0A). For example, adding the text string "Pretty Flowers" in Verdana bold with a size of 50 pixels at a distance of 10 pixels from the left border of the base image, where each word appears on a new line with line spacing of -15 pixels:  

!['Flowers' added to image with line-break](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/l_text:Verdana_50_bold_line_spacing_-15:Pretty%250AFlowers/fl_layer_apply,g_west,x_10/flowers.jpg)

```nodejs
cloudinary.image("flowers.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Verdana", font_size: 50, font_weight: "bold", text: "Pretty%250AFlowers"}},
  {flags: "layer_apply", gravity: "west", x: 10}
  ]})
```

```react
new CloudinaryImage("flowers.jpg").resize(scale().width(500)).overlay(
  source(
    text(
      "Pretty%0AFlowers",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .lineSpacing(-15)
    )
  ).position(
    new Position()
      .gravity(compass("west"))
      .offsetX(10)
  )
);
```

```vue
new CloudinaryImage("flowers.jpg").resize(scale().width(500)).overlay(
  source(
    text(
      "Pretty%0AFlowers",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .lineSpacing(-15)
    )
  ).position(
    new Position()
      .gravity(compass("west"))
      .offsetX(10)
  )
);
```

```angular
new CloudinaryImage("flowers.jpg").resize(scale().width(500)).overlay(
  source(
    text(
      "Pretty%0AFlowers",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .lineSpacing(-15)
    )
  ).position(
    new Position()
      .gravity(compass("west"))
      .offsetX(10)
  )
);
```

```js
new CloudinaryImage("flowers.jpg").resize(scale().width(500)).overlay(
  source(
    text(
      "Pretty%0AFlowers",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .lineSpacing(-15)
    )
  ).position(
    new Position()
      .gravity(compass("west"))
      .offsetX(10)
  )
);
```

```python
CloudinaryImage("flowers.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'font_family': "Verdana", 'font_size': 50, 'font_weight': "bold", 'text': "Pretty%250AFlowers"}},
  {'flags': "layer_apply", 'gravity': "west", 'x': 10}
  ])
```

```php
(new ImageTag('flowers.jpg'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Pretty%0AFlowers",(new TextStyle("Verdana",50))
	->fontWeight(
	FontWeight::bold())
->lineSpacing(-15)))
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::west()))
->offsetX(10))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Verdana").fontSize(50).fontWeight("bold").text("Pretty%250AFlowers")).chain()
  .flags("layer_apply").gravity("west").x(10)).imageTag("flowers.jpg");
```

```ruby
cl_image_tag("flowers.jpg", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Verdana", font_size: 50, font_weight: "bold", text: "Pretty%250AFlowers"}},
  {flags: "layer_apply", gravity: "west", x: 10}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("Verdana").FontSize(50).FontWeight("bold").Text("Pretty%250AFlowers")).Chain()
  .Flags("layer_apply").Gravity("west").X(10)).BuildImageTag("flowers.jpg")
```

```dart
cloudinary.image('flowers.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_text:Verdana_50_bold_line_spacing_-15:Pretty%0AFlowers/fl_layer_apply,g_west,x_10"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:Verdana_50_bold_line_spacing_-15:Pretty%250AFlowers").chain()
  .setFlags("layer_apply").setGravity("west").setX(10)).generate("flowers.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Verdana").fontSize(50).fontWeight("bold").text("Pretty%250AFlowers")).chain()
  .flags("layer_apply").gravity("west").x(10)).generate("flowers.jpg");
```

```flutter
cloudinary.image('flowers.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_text:Verdana_50_bold_line_spacing_-15:Pretty%0AFlowers/fl_layer_apply,g_west,x_10"));
```

```kotlin
cloudinary.image {
	publicId("flowers.jpg")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Pretty%0AFlowers",TextStyle("Verdana",50) {
	 fontWeight(
	FontWeight.bold())
 lineSpacing(-15) })) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.west()))
 offsetX(10) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("flowers.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("Verdana").fontSize(50).fontWeight("bold").text("Pretty%250AFlowers")},
  {flags: "layer_apply", gravity: "west", x: 10}
  ]})
```

```react_native
new CloudinaryImage("flowers.jpg").resize(scale().width(500)).overlay(
  source(
    text(
      "Pretty%0AFlowers",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .lineSpacing(-15)
    )
  ).position(
    new Position()
      .gravity(compass("west"))
      .offsetX(10)
  )
);
```

!['Flowers' added to video with line-break](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/l_text:Verdana_50_bold_line_spacing_-15:Pretty%250AFlowers/fl_layer_apply,g_west,x_10/lotus_flower.mp4)

```nodejs
cloudinary.video("lotus_flower", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Verdana", font_size: 50, font_weight: "bold", text: "Pretty%250AFlowers"}},
  {flags: "layer_apply", gravity: "west", x: 10}
  ]})
```

```react
new CloudinaryVideo("lotus_flower.mp4").resize(scale().width(500)).overlay(
  source(
    text(
      "Pretty%0AFlowers",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .lineSpacing(-15)
    )
  ).position(
    new Position()
      .gravity(compass("west"))
      .offsetX(10)
  )
);
```

```vue
new CloudinaryVideo("lotus_flower.mp4").resize(scale().width(500)).overlay(
  source(
    text(
      "Pretty%0AFlowers",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .lineSpacing(-15)
    )
  ).position(
    new Position()
      .gravity(compass("west"))
      .offsetX(10)
  )
);
```

```angular
new CloudinaryVideo("lotus_flower.mp4").resize(scale().width(500)).overlay(
  source(
    text(
      "Pretty%0AFlowers",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .lineSpacing(-15)
    )
  ).position(
    new Position()
      .gravity(compass("west"))
      .offsetX(10)
  )
);
```

```js
new CloudinaryVideo("lotus_flower.mp4").resize(scale().width(500)).overlay(
  source(
    text(
      "Pretty%0AFlowers",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .lineSpacing(-15)
    )
  ).position(
    new Position()
      .gravity(compass("west"))
      .offsetX(10)
  )
);
```

```python
CloudinaryVideo("lotus_flower").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'font_family': "Verdana", 'font_size': 50, 'font_weight': "bold", 'text': "Pretty%250AFlowers"}},
  {'flags': "layer_apply", 'gravity': "west", 'x': 10}
  ])
```

```php
(new VideoTag('lotus_flower.mp4'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Pretty%0AFlowers",(new TextStyle("Verdana",50))
	->fontWeight(
	FontWeight::bold())
->lineSpacing(-15)))
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::west()))
->offsetX(10))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Verdana").fontSize(50).fontWeight("bold").text("Pretty%250AFlowers")).chain()
  .flags("layer_apply").gravity("west").x(10)).videoTag("lotus_flower");
```

```ruby
cl_video_tag("lotus_flower", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Verdana", font_size: 50, font_weight: "bold", text: "Pretty%250AFlowers"}},
  {flags: "layer_apply", gravity: "west", x: 10}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("Verdana").FontSize(50).FontWeight("bold").Text("Pretty%250AFlowers")).Chain()
  .Flags("layer_apply").Gravity("west").X(10)).BuildVideoTag("lotus_flower")
```

```dart
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_text:Verdana_50_bold_line_spacing_-15:Pretty%0AFlowers/fl_layer_apply,g_west,x_10"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:Verdana_50_bold_line_spacing_-15:Pretty%250AFlowers").chain()
  .setFlags("layer_apply").setGravity("west").setX(10)).generate("lotus_flower.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Verdana").fontSize(50).fontWeight("bold").text("Pretty%250AFlowers")).chain()
  .flags("layer_apply").gravity("west").x(10)).resourceType("video").generate("lotus_flower.mp4");
```

```flutter
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_text:Verdana_50_bold_line_spacing_-15:Pretty%0AFlowers/fl_layer_apply,g_west,x_10"));
```

```kotlin
cloudinary.video {
	publicId("lotus_flower.mp4")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Pretty%0AFlowers",TextStyle("Verdana",50) {
	 fontWeight(
	FontWeight.bold())
 lineSpacing(-15) })) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.west()))
 offsetX(10) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("lotus_flower", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("Verdana").fontSize(50).fontWeight("bold").text("Pretty%250AFlowers")},
  {flags: "layer_apply", gravity: "west", x: 10}
  ]})
```

```react_native
new CloudinaryVideo("lotus_flower.mp4").resize(scale().width(500)).overlay(
  source(
    text(
      "Pretty%0AFlowers",
      new TextStyle("Verdana", 50)
        .fontWeight("bold")
        .lineSpacing(-15)
    )
  ).position(
    new Position()
      .gravity(compass("west"))
      .offsetX(10)
  )
);
```

### Auto-line breaks

Cloudinary can also automatically wrap your text into multiple lines based on a specified maximum width for the text string. To do this, apply the `fit` crop mode to the text layer and specify the `width` to use for word wrapping. This setting tells Cloudinary to automatically wrap the actual text content onto a new line once the width is reached. 

> **NOTE**: `c_fit` (called `textFit` in the latest major version of some SDKs) is the only 'resize' option that can be used as a qualifier of text overlays.

For example, to add a long text string in bold Neucha font with a size of 26 pixels to the base image that wraps at a width of 400 pixels:

![Multi-line text string](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.,w_400/fl_layer_apply/flowers.jpg)

```nodejs
cloudinary.image("flowers.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryImage("flowers.jpg").addTransformation(
  "c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"
);
```

```vue
new CloudinaryImage("flowers.jpg").addTransformation(
  "c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"
);
```

```angular
new CloudinaryImage("flowers.jpg").addTransformation(
  "c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"
);
```

```js
new CloudinaryImage("flowers.jpg").addTransformation(
  "c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"
);
```

```python
CloudinaryImage("flowers.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'font_family': "Neucha", 'font_size': 26, 'font_weight': "bold", 'text': "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, 'width': 400, 'crop': "fit"},
  {'flags': "layer_apply"}
  ])
```

```php
(new ImageTag('flowers.jpg'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",(new TextStyle("Neucha",26))
	->fontWeight(
	FontWeight::bold())
	)
	->textFit(
	TextFit::size(400))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).crop("fit").chain()
  .flags("layer_apply")).imageTag("flowers.jpg");
```

```ruby
cl_image_tag("flowers.jpg", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("Neucha").FontSize(26).FontWeight("bold").Text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).Width(400).Crop("fit").Chain()
  .Flags("layer_apply")).BuildImageTag("flowers.jpg")
```

```dart
cloudinary.image('flowers.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.").setWidth(400).setCrop("fit").chain()
  .setFlags("layer_apply")).generate("flowers.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).crop("fit").chain()
  .flags("layer_apply")).generate("flowers.jpg");
```

```flutter
cloudinary.image('flowers.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"));
```

```kotlin
cloudinary.image {
	publicId("flowers.jpg")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",TextStyle("Neucha",26) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textFit(
	TextFit.size(400))
	 })) 
}.generate()
```

```jquery
$.cloudinary.image("flowers.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."), width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryImage("flowers.jpg").addTransformation(
  "c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"
);
```

![Multi-line text string](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.,w_400/fl_layer_apply/lotus_flower.mp4)

```nodejs
cloudinary.video("lotus_flower", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryVideo("lotus_flower.mp4").addTransformation(
  "c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"
);
```

```vue
new CloudinaryVideo("lotus_flower.mp4").addTransformation(
  "c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"
);
```

```angular
new CloudinaryVideo("lotus_flower.mp4").addTransformation(
  "c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"
);
```

```js
new CloudinaryVideo("lotus_flower.mp4").addTransformation(
  "c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"
);
```

```python
CloudinaryVideo("lotus_flower").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'font_family': "Neucha", 'font_size': 26, 'font_weight': "bold", 'text': "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, 'width': 400, 'crop': "fit"},
  {'flags': "layer_apply"}
  ])
```

```php
(new VideoTag('lotus_flower.mp4'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",(new TextStyle("Neucha",26))
	->fontWeight(
	FontWeight::bold())
	)
	->textFit(
	TextFit::size(400))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).crop("fit").chain()
  .flags("layer_apply")).videoTag("lotus_flower");
```

```ruby
cl_video_tag("lotus_flower", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("Neucha").FontSize(26).FontWeight("bold").Text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).Width(400).Crop("fit").Chain()
  .Flags("layer_apply")).BuildVideoTag("lotus_flower")
```

```dart
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.").setWidth(400).setCrop("fit").chain()
  .setFlags("layer_apply")).generate("lotus_flower.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).crop("fit").chain()
  .flags("layer_apply")).resourceType("video").generate("lotus_flower.mp4");
```

```flutter
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"));
```

```kotlin
cloudinary.video {
	publicId("lotus_flower.mp4")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",TextStyle("Neucha",26) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textFit(
	TextFit.size(400))
	 })) 
}.generate()
```

```jquery
$.cloudinary.video("lotus_flower", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."), width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryVideo("lotus_flower.mp4").addTransformation(
  "c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"
);
```

When using the `fit` (`textFit` in some SDKs) crop mode, you must specify a width for your text overlay, but height is optional. Line breaks are applied as needed to achieve the requested width and/or height rectangle. 

The specified font size of your overlay stays as is, even if the resulting text overlay height exceeds the height of its hosting image. So, if you don't limit the overlay height, the height of the image expands to accommodate large texts: 

![Multi-line text no height limit](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.,w_400/fl_layer_apply/flowers.jpg)

```nodejs
cloudinary.image("flowers.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryImage('flowers.jpg')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply");
```

```vue
new CloudinaryImage('flowers.jpg')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply");
```

```angular
new CloudinaryImage('flowers.jpg')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply");
```

```js
new CloudinaryImage('flowers.jpg')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply");
```

```python
CloudinaryImage("flowers.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'font_family': "Neucha", 'font_size': 26, 'font_weight': "bold", 'text': "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, 'width': 400, 'crop': "fit"},
  {'flags': "layer_apply"}
  ])
```

```php
(new ImageTag('flowers.jpg'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",(new TextStyle("Neucha",26))
	->fontWeight(
	FontWeight::bold())
	)
	->textFit(
	TextFit::size(400))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).crop("fit").chain()
  .flags("layer_apply")).imageTag("flowers.jpg");
```

```ruby
cl_image_tag("flowers.jpg", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("Neucha").FontSize(26).FontWeight("bold").Text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).Width(400).Crop("fit").Chain()
  .Flags("layer_apply")).BuildImageTag("flowers.jpg")
```

```dart
cloudinary.image('flowers.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.").setWidth(400).setCrop("fit").chain()
  .setFlags("layer_apply")).generate("flowers.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).crop("fit").chain()
  .flags("layer_apply")).generate("flowers.jpg");
```

```flutter
cloudinary.image('flowers.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"));
```

```kotlin
cloudinary.image {
	publicId("flowers.jpg")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",TextStyle("Neucha",26) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textFit(
	TextFit.size(400))
	 })) 
}.generate()
```

```jquery
$.cloudinary.image("flowers.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."), width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryImage('flowers.jpg')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply");
```

![Multi-line text no height limit](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.,w_400/fl_layer_apply/lotus_flower.mp4)

```nodejs
cloudinary.video("lotus_flower", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryVideo('lotus_flower.mp4')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply");
```

```vue
new CloudinaryVideo('lotus_flower.mp4')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply");
```

```angular
new CloudinaryVideo('lotus_flower.mp4')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply");
```

```js
new CloudinaryVideo('lotus_flower.mp4')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply");
```

```python
CloudinaryVideo("lotus_flower").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'font_family': "Neucha", 'font_size': 26, 'font_weight': "bold", 'text': "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, 'width': 400, 'crop': "fit"},
  {'flags': "layer_apply"}
  ])
```

```php
(new VideoTag('lotus_flower.mp4'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",(new TextStyle("Neucha",26))
	->fontWeight(
	FontWeight::bold())
	)
	->textFit(
	TextFit::size(400))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).crop("fit").chain()
  .flags("layer_apply")).videoTag("lotus_flower");
```

```ruby
cl_video_tag("lotus_flower", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("Neucha").FontSize(26).FontWeight("bold").Text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).Width(400).Crop("fit").Chain()
  .Flags("layer_apply")).BuildVideoTag("lotus_flower")
```

```dart
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.").setWidth(400).setCrop("fit").chain()
  .setFlags("layer_apply")).generate("lotus_flower.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).crop("fit").chain()
  .flags("layer_apply")).resourceType("video").generate("lotus_flower.mp4");
```

```flutter
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply"));
```

```kotlin
cloudinary.video {
	publicId("lotus_flower.mp4")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",TextStyle("Neucha",26) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textFit(
	TextFit.size(400))
	 })) 
}.generate()
```

```jquery
$.cloudinary.video("lotus_flower", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."), width: 400, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryVideo('lotus_flower.mp4')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400/fl_layer_apply");
```

If you do limit the height of your overlay, any text that does not fit within the space defined is cut and an ellipsis (`...`) is added to the end of the text string to indicate that the text was truncated. 

To define a maximum height for the multi-line text add the `height` parameter in addition to `width` in the 'resize' transformation of your text layer:

![Multi-line text limited height](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.,w_400,h_250/fl_layer_apply/flowers.jpg)

```nodejs
cloudinary.image("flowers.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, height: 250, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryImage('flowers.jpg')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply");
```

```vue
new CloudinaryImage('flowers.jpg')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply");
```

```angular
new CloudinaryImage('flowers.jpg')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply");
```

```js
new CloudinaryImage('flowers.jpg')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply");
```

```python
CloudinaryImage("flowers.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'font_family': "Neucha", 'font_size': 26, 'font_weight': "bold", 'text': "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, 'width': 400, 'height': 250, 'crop': "fit"},
  {'flags': "layer_apply"}
  ])
```

```php
(new ImageTag('flowers.jpg'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",(new TextStyle("Neucha",26))
	->fontWeight(
	FontWeight::bold())
	)
	->textFit(
	TextFit::size(400)->height(250))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).height(250).crop("fit").chain()
  .flags("layer_apply")).imageTag("flowers.jpg");
```

```ruby
cl_image_tag("flowers.jpg", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, height: 250, crop: "fit"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("Neucha").FontSize(26).FontWeight("bold").Text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).Width(400).Height(250).Crop("fit").Chain()
  .Flags("layer_apply")).BuildImageTag("flowers.jpg")
```

```dart
cloudinary.image('flowers.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.").setWidth(400).setHeight(250).setCrop("fit").chain()
  .setFlags("layer_apply")).generate("flowers.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).height(250).crop("fit").chain()
  .flags("layer_apply")).generate("flowers.jpg");
```

```flutter
cloudinary.image('flowers.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply"));
```

```kotlin
cloudinary.image {
	publicId("flowers.jpg")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",TextStyle("Neucha",26) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textFit(
	TextFit.size(400) { height(250) })
	 })) 
}.generate()
```

```jquery
$.cloudinary.image("flowers.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."), width: 400, height: 250, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryImage('flowers.jpg')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply");
```

![Multi-line text limited height](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.,w_400,h_250/fl_layer_apply/lotus_flower.mp4)

```nodejs
cloudinary.video("lotus_flower", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, height: 250, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryVideo('lotus_flower.mp4')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply");
```

```vue
new CloudinaryVideo('lotus_flower.mp4')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply");
```

```angular
new CloudinaryVideo('lotus_flower.mp4')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply");
```

```js
new CloudinaryVideo('lotus_flower.mp4')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply");
```

```python
CloudinaryVideo("lotus_flower").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'font_family': "Neucha", 'font_size': 26, 'font_weight': "bold", 'text': "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, 'width': 400, 'height': 250, 'crop': "fit"},
  {'flags': "layer_apply"}
  ])
```

```php
(new VideoTag('lotus_flower.mp4'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",(new TextStyle("Neucha",26))
	->fontWeight(
	FontWeight::bold())
	)
	->textFit(
	TextFit::size(400)->height(250))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).height(250).crop("fit").chain()
  .flags("layer_apply")).videoTag("lotus_flower");
```

```ruby
cl_video_tag("lotus_flower", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {font_family: "Neucha", font_size: 26, font_weight: "bold", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 400, height: 250, crop: "fit"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().FontFamily("Neucha").FontSize(26).FontWeight("bold").Text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).Width(400).Height(250).Crop("fit").Chain()
  .Flags("layer_apply")).BuildVideoTag("lotus_flower")
```

```dart
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:Neucha_26_bold:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.").setWidth(400).setHeight(250).setCrop("fit").chain()
  .setFlags("layer_apply")).generate("lotus_flower.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(400).height(250).crop("fit").chain()
  .flags("layer_apply")).resourceType("video").generate("lotus_flower.mp4");
```

```flutter
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply"));
```

```kotlin
cloudinary.video {
	publicId("lotus_flower.mp4")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",TextStyle("Neucha",26) {
	 fontWeight(
	FontWeight.bold())
	 }) {
	 textFit(
	TextFit.size(400) { height(250) })
	 })) 
}.generate()
```

```jquery
$.cloudinary.video("lotus_flower", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().fontFamily("Neucha").fontSize(26).fontWeight("bold").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.%0D%0A%0D%0ALorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."), width: 400, height: 250, crop: "fit"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryVideo('lotus_flower.mp4')
	.addTransformation("c_scale,w_500/c_fit,l_text:Neucha_26_bold:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.
Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_400,h_250/fl_layer_apply");
```

You can also set text alignment and line spacing values to further control the text's appearance. Other resize parameters can be applied as an action over the entire overlay (before the fl_layer_apply) to resize the resulting the text-image overlay as a whole after it's created.

For example, to add a long text string in center aligned bold Times font with a size of 14 pixels to the base image, that wraps at a width of 200 pixels and is limited to a height of 150 pixels; and then rotate the text by 9 degrees and set 30 pixels from the north border to better align with the underlying image:

![Multi-line text limited with height](https://res.cloudinary.com/demo/image/upload/c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.,w_200/a_9/fl_layer_apply,g_north,y_30/envelope.jpg)

```nodejs
cloudinary.image("envelope.jpg", {transformation: [
  {width: 300, crop: "scale"},
  {height: 150, overlay: {font_family: "Times", font_size: 18, font_weight: "bold", text_align: "center", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 200, crop: "fit"},
  {angle: 9},
  {flags: "layer_apply", gravity: "north", y: 30}
  ]})
```

```react
new CloudinaryImage("envelope.jpg").addTransformation(
  "c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"
);
```

```vue
new CloudinaryImage("envelope.jpg").addTransformation(
  "c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"
);
```

```angular
new CloudinaryImage("envelope.jpg").addTransformation(
  "c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"
);
```

```js
new CloudinaryImage("envelope.jpg").addTransformation(
  "c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"
);
```

```python
CloudinaryImage("envelope.jpg").image(transformation=[
  {'width': 300, 'crop': "scale"},
  {'height': 150, 'overlay': {'font_family': "Times", 'font_size': 18, 'font_weight': "bold", 'text_align': "center", 'text': "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, 'width': 200, 'crop': "fit"},
  {'angle': 9},
  {'flags': "layer_apply", 'gravity': "north", 'y': 30}
  ])
```

```php
(new ImageTag('envelope.jpg'))
	->resize(Resize::scale()->width(300))
	->overlay(Overlay::source(
	Source::text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",(new TextStyle("Times",18))
	->fontWeight(
	FontWeight::bold())
	->textAlignment(
	TextAlignment::center())
	)
	->textFit(
	TextFit::size(200)->height(150))
	->transformation((new Transformation())
	->rotate(Rotate::byAngle(9)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::north()))
->offsetY(30))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(300).crop("scale").chain()
  .height(150).overlay(new TextLayer().fontFamily("Times").fontSize(18).fontWeight("bold").textAlign("center").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(200).crop("fit").chain()
  .angle(9).chain()
  .flags("layer_apply").gravity("north").y(30)).imageTag("envelope.jpg");
```

```ruby
cl_image_tag("envelope.jpg", transformation: [
  {width: 300, crop: "scale"},
  {height: 150, overlay: {font_family: "Times", font_size: 18, font_weight: "bold", text_align: "center", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 200, crop: "fit"},
  {angle: 9},
  {flags: "layer_apply", gravity: "north", y: 30}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(300).Crop("scale").Chain()
  .Height(150).Overlay(new TextLayer().FontFamily("Times").FontSize(18).FontWeight("bold").TextAlign("center").Text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).Width(200).Crop("fit").Chain()
  .Angle(9).Chain()
  .Flags("layer_apply").Gravity("north").Y(30)).BuildImageTag("envelope.jpg")
```

```dart
cloudinary.image('envelope.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(300).setCrop("scale").chain()
  .setHeight(150).setOverlay("text:Times_18_bold_center:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.").setWidth(200).setCrop("fit").chain()
  .setAngle(9).chain()
  .setFlags("layer_apply").setGravity("north").setY(30)).generate("envelope.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(300).crop("scale").chain()
  .height(150).overlay(new TextLayer().fontFamily("Times").fontSize(18).fontWeight("bold").textAlign("center").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(200).crop("fit").chain()
  .angle(9).chain()
  .flags("layer_apply").gravity("north").y(30)).generate("envelope.jpg");
```

```flutter
cloudinary.image('envelope.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"));
```

```kotlin
cloudinary.image {
	publicId("envelope.jpg")
	 resize(Resize.scale() { width(300) })
	 overlay(Overlay.source(
	Source.text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",TextStyle("Times",18) {
	 fontWeight(
	FontWeight.bold())
	 textAlignment(
	TextAlignment.center())
	 }) {
	 textFit(
	TextFit.size(200) { height(150) })
	 transformation(Transformation {
	 rotate(Rotate.byAngle(9)) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.north()))
 offsetY(30) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("envelope.jpg", {transformation: [
  {width: 300, crop: "scale"},
  {height: 150, overlay: new cloudinary.TextLayer().fontFamily("Times").fontSize(18).fontWeight("bold").textAlign("center").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."), width: 200, crop: "fit"},
  {angle: 9},
  {flags: "layer_apply", gravity: "north", y: 30}
  ]})
```

```react_native
new CloudinaryImage("envelope.jpg").addTransformation(
  "c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"
);
```

![Multi-line text limited with height](https://res.cloudinary.com/demo/video/upload/c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.,w_200/a_9/fl_layer_apply,g_north,y_30/lotus_flower.mp4)

```nodejs
cloudinary.video("lotus_flower", {transformation: [
  {width: 300, crop: "scale"},
  {height: 150, overlay: {font_family: "Times", font_size: 18, font_weight: "bold", text_align: "center", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 200, crop: "fit"},
  {angle: 9},
  {flags: "layer_apply", gravity: "north", y: 30}
  ]})
```

```react
new CloudinaryVideo("lotus_flower.mp4").addTransformation(
  "c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"
);
```

```vue
new CloudinaryVideo("lotus_flower.mp4").addTransformation(
  "c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"
);
```

```angular
new CloudinaryVideo("lotus_flower.mp4").addTransformation(
  "c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"
);
```

```js
new CloudinaryVideo("lotus_flower.mp4").addTransformation(
  "c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"
);
```

```python
CloudinaryVideo("lotus_flower").video(transformation=[
  {'width': 300, 'crop': "scale"},
  {'height': 150, 'overlay': {'font_family': "Times", 'font_size': 18, 'font_weight': "bold", 'text_align': "center", 'text': "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, 'width': 200, 'crop': "fit"},
  {'angle': 9},
  {'flags': "layer_apply", 'gravity': "north", 'y': 30}
  ])
```

```php
(new VideoTag('lotus_flower.mp4'))
	->resize(Resize::scale()->width(300))
	->overlay(Overlay::source(
	Source::text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",(new TextStyle("Times",18))
	->fontWeight(
	FontWeight::bold())
	->textAlignment(
	TextAlignment::center())
	)
	->textFit(
	TextFit::size(200)->height(150))
	->transformation((new Transformation())
	->rotate(Rotate::byAngle(9)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::north()))
->offsetY(30))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(300).crop("scale").chain()
  .height(150).overlay(new TextLayer().fontFamily("Times").fontSize(18).fontWeight("bold").textAlign("center").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(200).crop("fit").chain()
  .angle(9).chain()
  .flags("layer_apply").gravity("north").y(30)).videoTag("lotus_flower");
```

```ruby
cl_video_tag("lotus_flower", transformation: [
  {width: 300, crop: "scale"},
  {height: 150, overlay: {font_family: "Times", font_size: 18, font_weight: "bold", text_align: "center", text: "Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."}, width: 200, crop: "fit"},
  {angle: 9},
  {flags: "layer_apply", gravity: "north", y: 30}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(300).Crop("scale").Chain()
  .Height(150).Overlay(new TextLayer().FontFamily("Times").FontSize(18).FontWeight("bold").TextAlign("center").Text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).Width(200).Crop("fit").Chain()
  .Angle(9).Chain()
  .Flags("layer_apply").Gravity("north").Y(30)).BuildVideoTag("lotus_flower")
```

```dart
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(300).setCrop("scale").chain()
  .setHeight(150).setOverlay("text:Times_18_bold_center:Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.").setWidth(200).setCrop("fit").chain()
  .setAngle(9).chain()
  .setFlags("layer_apply").setGravity("north").setY(30)).generate("lotus_flower.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(300).crop("scale").chain()
  .height(150).overlay(new TextLayer().fontFamily("Times").fontSize(18).fontWeight("bold").textAlign("center").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat.")).width(200).crop("fit").chain()
  .angle(9).chain()
  .flags("layer_apply").gravity("north").y(30)).resourceType("video").generate("lotus_flower.mp4");
```

```flutter
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"));
```

```kotlin
cloudinary.video {
	publicId("lotus_flower.mp4")
	 resize(Resize.scale() { width(300) })
	 overlay(Overlay.source(
	Source.text("Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.",TextStyle("Times",18) {
	 fontWeight(
	FontWeight.bold())
	 textAlignment(
	TextAlignment.center())
	 }) {
	 textFit(
	TextFit.size(200) { height(150) })
	 transformation(Transformation {
	 rotate(Rotate.byAngle(9)) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.north()))
 offsetY(30) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("lotus_flower", {transformation: [
  {width: 300, crop: "scale"},
  {height: 150, overlay: new cloudinary.TextLayer().fontFamily("Times").fontSize(18).fontWeight("bold").textAlign("center").text("Lorem%2520ipsum%2520dolor%2520sit%2520amet%2520consectetur%2520adipisicing%2520elit%2520sed%2520do%2520eiusmod%2520tempor%2520incididunt%2520ut%2520labore%2520et%2520dolore%2520magna%2520aliqua.%2520Ut%2520enim%2520ad%2520minim%2520veniam%2520quis%2520nostrud%2520exercitation%2520ullamco%2520laboris%2520nisi%2520ut%2520aliquip%2520ex%2520ea%2520commodo%2520consequat."), width: 200, crop: "fit"},
  {angle: 9},
  {flags: "layer_apply", gravity: "north", y: 30}
  ]})
```

```react_native
new CloudinaryVideo("lotus_flower.mp4").addTransformation(
  "c_scale,w_300/c_fit,h_150,l_text:Times_18_bold_center:Lorem%20ipsum%20dolor%20sit%20amet%20consectetur%20adipisicing%20elit%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.,w_200/a_9/fl_layer_apply,g_north,y_30"
);
```

### Special characters

Text strings containing special characters need to be modified (escaped) for use with the text overlay feature. This is relevant for any special characters that would not be allowed "as is" in a valid URL path, as well as other special Unicode characters. These text strings should be escaped using %-based UTF-8 encoding to ensure the text string is valid (for example, replace `?` with `%3F` and use `%20` for spaces between words). This encoding is done automatically when embedding images using the Cloudinary SDK [helper methods](image_transformations#embedding_images_in_web_pages) and only needs to be done when manually building the asset delivery URL.

Additionally, to include a comma (`,`) forward slash (`/`), percent sign (`%`) or an emoji character in a text overlay, you must **double-escape** the `%` sign within those codes. For example: 

* Add a comma to a text overlay as `%252C` (and not just `%2C`). 

* The escaped URL code for the flower emoji is `%E2%9D%80`. To include this emoji in a text overlay, you must also escape each of the `%` signs in the escaped code: `l_text:Arial_80:Comfort%25E2%259D%2580`:
  
![Adding dynamic text to image](https://res.cloudinary.com/demo/image/upload/w_500/l_text:Arial_40:Comfort%25E2%259D%2580/blank_shirt.jpg "with_image:true, with_code:false")

![Adding dynamic text to video](https://res.cloudinary.com/demo/video/upload/w_500/l_text:Arial_40:Comfort%25E2%259D%2580/docs/hotel_room.mp4 "with_image:true, with_code:false")

### Custom fonts

By default, only universally available fonts are supported for text overlays. However, if you want to use a non-standard font, you can upload it to Cloudinary as a [raw](upload_parameters#uploading_non_media_files_as_raw_files), [authenticated](upload_parameters#authenticated_assets) file and then specify the font's full `public_id` (including extension) as the font for your overlay:

```multi
|ruby 
Cloudinary::Uploader.upload("AlexBrush-Regular.ttf", 
	resource_type: 'raw',
	type: 'authenticated', 
	public_id: 'AlexBrush-Regular.ttf')

|php_2
use Cloudinary\Api\Upload\UploadApi;

(new UploadApi())->upload('AlexBrush-Regular.ttf', [
  'public_id' => 'AlexBrush-Regular.ttf',  
  'type' => 'authenticated', 
  'resource_type' => 'raw']);
    
  
|python
cloudinary.uploader.upload("AlexBrush-Regular.ttf", 
  public_id = "AlexBrush-Regular.ttf",
  type = "authenticated",  
  resource_type = "raw")

|nodejs
cloudinary.v2.uploader
.upload("AlexBrush-Regular.ttf", { 
  public_id: "AlexBrush-Regular.ttf", 
  type: "authenticated", 
  resource_type: "raw"})
.then(result=>console.log(result));
  
|java
Map params = ObjectUtils.asMap(
    "public_id", "AlexBrush-Regular.ttf", 
    "type", "authenticated",
    "resource_type", "raw");
Map uploadResult = cloudinary.uploader().upload(new File("AlexBrush-Regular.ttf"), params);

|csharp
var uploadParams = new RawUploadParams()
    {
        File = new FileDescription(@"AlexBrush-Regular.ttf"),        
        PublicId = "AlexBrush-Regular.ttf",
        Type = "authenticated"};
var uploadResult = cloudinary.Upload(uploadParams);

|android
MediaManager.get().upload("AlexBrush-Regular.ttf")
   .unsigned("preset1")
   .option("public_id", "AlexBrush-Regular.ttf")
   .option("type", "authenticated")
   .option("resource_type", "raw")
   .dispatch();

|swift
let params = CLDUploadRequestParams().setPublicId("AlexBrush-Regular.ttf")
let request = cloudinary.createUploader().upload(data: fileUrl, uploadPreset: "sample_preset", params: params)

|curl
curl https://api.cloudinary.com/v1_1/demo/image/upload -X POST --data 'file=AlexBrush-Regular.ttf&public_id="AlexBrush-Regular.ttf"&type=authenticated&resource_type="raw"&timestamp=173719931&api_key=436464676&signature=a788d68f86a6f868af'
```

![Custom font overlay](https://res.cloudinary.com/demo/image/upload/co_white,l_text:AlexBrush-Regular.ttf_100:Happy%2520New%2520Year/fl_layer_apply,g_north_west,x_30,y_30/fireworks.jpg "thumb: w_500")

```nodejs
cloudinary.image("fireworks.jpg", {transformation: [
  {color: "white", overlay: {font_family: "ttf", font_size: 100, text: "Happy%2520New%2520Year"}},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30}
  ]})
```

```react
new CloudinaryImage("fireworks.jpg").overlay(
  source(
    text(
      "Happy%20New%20Year",
      new TextStyle("AlexBrush-Regular.ttf", 100)
    ).textColor("white")
  ).position(
    new Position()
      .gravity(compass("north_west"))
      .offsetX(30)
      .offsetY(30)
  )
);
```

```vue
new CloudinaryImage("fireworks.jpg").overlay(
  source(
    text(
      "Happy%20New%20Year",
      new TextStyle("AlexBrush-Regular.ttf", 100)
    ).textColor("white")
  ).position(
    new Position()
      .gravity(compass("north_west"))
      .offsetX(30)
      .offsetY(30)
  )
);
```

```angular
new CloudinaryImage("fireworks.jpg").overlay(
  source(
    text(
      "Happy%20New%20Year",
      new TextStyle("AlexBrush-Regular.ttf", 100)
    ).textColor("white")
  ).position(
    new Position()
      .gravity(compass("north_west"))
      .offsetX(30)
      .offsetY(30)
  )
);
```

```js
new CloudinaryImage("fireworks.jpg").overlay(
  source(
    text(
      "Happy%20New%20Year",
      new TextStyle("AlexBrush-Regular.ttf", 100)
    ).textColor("white")
  ).position(
    new Position()
      .gravity(compass("north_west"))
      .offsetX(30)
      .offsetY(30)
  )
);
```

```python
CloudinaryImage("fireworks.jpg").image(transformation=[
  {'color': "white", 'overlay': {'font_family': "ttf", 'font_size': 100, 'text': "Happy%2520New%2520Year"}},
  {'flags': "layer_apply", 'gravity': "north_west", 'x': 30, 'y': 30}
  ])
```

```php
(new ImageTag('fireworks.jpg'))
	->overlay(Overlay::source(
	Source::text("Happy%20New%20Year",(new TextStyle("AlexBrush-Regular.ttf",100)))
	->textColor(Color::WHITE)
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northWest()))
->offsetX(30)
->offsetY(30))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .color("white").overlay(new TextLayer().fontFamily("ttf").fontSize(100).text("Happy%2520New%2520Year")).chain()
  .flags("layer_apply").gravity("north_west").x(30).y(30)).imageTag("fireworks.jpg");
```

```ruby
cl_image_tag("fireworks.jpg", transformation: [
  {color: "white", overlay: {font_family: "ttf", font_size: 100, text: "Happy%2520New%2520Year"}},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Color("white").Overlay(new TextLayer().FontFamily("ttf").FontSize(100).Text("Happy%2520New%2520Year")).Chain()
  .Flags("layer_apply").Gravity("north_west").X(30).Y(30)).BuildImageTag("fireworks.jpg")
```

```dart
cloudinary.image('fireworks.jpg').transformation(Transformation()
	.addTransformation("co_white,l_text:AlexBrush-Regular.ttf_100:Happy%20New%20Year/fl_layer_apply,g_north_west,x_30,y_30"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setColor("white").setOverlay("text:AlexBrush-Regular.ttf_100:Happy%2520New%2520Year").chain()
  .setFlags("layer_apply").setGravity("north_west").setX(30).setY(30)).generate("fireworks.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .color("white").overlay(new TextLayer().fontFamily("ttf").fontSize(100).text("Happy%2520New%2520Year")).chain()
  .flags("layer_apply").gravity("north_west").x(30).y(30)).generate("fireworks.jpg");
```

```flutter
cloudinary.image('fireworks.jpg').transformation(Transformation()
	.addTransformation("co_white,l_text:AlexBrush-Regular.ttf_100:Happy%20New%20Year/fl_layer_apply,g_north_west,x_30,y_30"));
```

```kotlin
cloudinary.image {
	publicId("fireworks.jpg")
	 overlay(Overlay.source(
	Source.text("Happy%20New%20Year",TextStyle("AlexBrush-Regular.ttf",100)) {
	 textColor(Color.WHITE)
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northWest()))
 offsetX(30)
 offsetY(30) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("fireworks.jpg", {transformation: [
  {color: "white", overlay: new cloudinary.TextLayer().fontFamily("ttf").fontSize(100).text("Happy%2520New%2520Year")},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30}
  ]})
```

```react_native
new CloudinaryImage("fireworks.jpg").overlay(
  source(
    text(
      "Happy%20New%20Year",
      new TextStyle("AlexBrush-Regular.ttf", 100)
    ).textColor("white")
  ).position(
    new Position()
      .gravity(compass("north_west"))
      .offsetX(30)
      .offsetY(30)
  )
);
```

![Custom font overlay](https://res.cloudinary.com/demo/video/upload/w_1000/co_white,l_text:AlexBrush-Regular.ttf_50:Happy%2520New%2520Year/fl_layer_apply,g_north_west,x_30,y_30/new_year_fireworks.mp4 "thumb: w_500")

```nodejs
cloudinary.video("new_year_fireworks", {transformation: [
  {width: 1000, crop: "scale"},
  {color: "white", overlay: {font_family: "ttf", font_size: 50, text: "Happy%2520New%2520Year"}},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30}
  ]})
```

```react
new CloudinaryVideo("new_year_fireworks.mp4")
  .resize(scale().width(1000))
  .overlay(
    source(
      text(
        "Happy%20New%20Year",
        new TextStyle("AlexBrush-Regular.ttf", 50)
      ).textColor("white")
    ).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(30)
        .offsetY(30)
    )
  );
```

```vue
new CloudinaryVideo("new_year_fireworks.mp4")
  .resize(scale().width(1000))
  .overlay(
    source(
      text(
        "Happy%20New%20Year",
        new TextStyle("AlexBrush-Regular.ttf", 50)
      ).textColor("white")
    ).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(30)
        .offsetY(30)
    )
  );
```

```angular
new CloudinaryVideo("new_year_fireworks.mp4")
  .resize(scale().width(1000))
  .overlay(
    source(
      text(
        "Happy%20New%20Year",
        new TextStyle("AlexBrush-Regular.ttf", 50)
      ).textColor("white")
    ).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(30)
        .offsetY(30)
    )
  );
```

```js
new CloudinaryVideo("new_year_fireworks.mp4")
  .resize(scale().width(1000))
  .overlay(
    source(
      text(
        "Happy%20New%20Year",
        new TextStyle("AlexBrush-Regular.ttf", 50)
      ).textColor("white")
    ).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(30)
        .offsetY(30)
    )
  );
```

```python
CloudinaryVideo("new_year_fireworks").video(transformation=[
  {'width': 1000, 'crop': "scale"},
  {'color': "white", 'overlay': {'font_family': "ttf", 'font_size': 50, 'text': "Happy%2520New%2520Year"}},
  {'flags': "layer_apply", 'gravity': "north_west", 'x': 30, 'y': 30}
  ])
```

```php
(new VideoTag('new_year_fireworks.mp4'))
	->resize(Resize::scale()->width(1000))
	->overlay(Overlay::source(
	Source::text("Happy%20New%20Year",(new TextStyle("AlexBrush-Regular.ttf",50)))
	->textColor(Color::WHITE)
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northWest()))
->offsetX(30)
->offsetY(30))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(1000).crop("scale").chain()
  .color("white").overlay(new TextLayer().fontFamily("ttf").fontSize(50).text("Happy%2520New%2520Year")).chain()
  .flags("layer_apply").gravity("north_west").x(30).y(30)).videoTag("new_year_fireworks");
```

```ruby
cl_video_tag("new_year_fireworks", transformation: [
  {width: 1000, crop: "scale"},
  {color: "white", overlay: {font_family: "ttf", font_size: 50, text: "Happy%2520New%2520Year"}},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(1000).Crop("scale").Chain()
  .Color("white").Overlay(new TextLayer().FontFamily("ttf").FontSize(50).Text("Happy%2520New%2520Year")).Chain()
  .Flags("layer_apply").Gravity("north_west").X(30).Y(30)).BuildVideoTag("new_year_fireworks")
```

```dart
cloudinary.video('new_year_fireworks.mp4').transformation(Transformation()
	.addTransformation("w_1000/co_white,l_text:AlexBrush-Regular.ttf_50:Happy%20New%20Year/fl_layer_apply,g_north_west,x_30,y_30"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(1000).setCrop("scale").chain()
  .setColor("white").setOverlay("text:AlexBrush-Regular.ttf_50:Happy%2520New%2520Year").chain()
  .setFlags("layer_apply").setGravity("north_west").setX(30).setY(30)).generate("new_year_fireworks.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(1000).crop("scale").chain()
  .color("white").overlay(new TextLayer().fontFamily("ttf").fontSize(50).text("Happy%2520New%2520Year")).chain()
  .flags("layer_apply").gravity("north_west").x(30).y(30)).resourceType("video").generate("new_year_fireworks.mp4");
```

```flutter
cloudinary.video('new_year_fireworks.mp4').transformation(Transformation()
	.addTransformation("w_1000/co_white,l_text:AlexBrush-Regular.ttf_50:Happy%20New%20Year/fl_layer_apply,g_north_west,x_30,y_30"));
```

```kotlin
cloudinary.video {
	publicId("new_year_fireworks.mp4")
	 resize(Resize.scale() { width(1000) })
	 overlay(Overlay.source(
	Source.text("Happy%20New%20Year",TextStyle("AlexBrush-Regular.ttf",50)) {
	 textColor(Color.WHITE)
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northWest()))
 offsetX(30)
 offsetY(30) })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("new_year_fireworks", {transformation: [
  {width: 1000, crop: "scale"},
  {color: "white", overlay: new cloudinary.TextLayer().fontFamily("ttf").fontSize(50).text("Happy%2520New%2520Year")},
  {flags: "layer_apply", gravity: "north_west", x: 30, y: 30}
  ]})
```

```react_native
new CloudinaryVideo("new_year_fireworks.mp4")
  .resize(scale().width(1000))
  .overlay(
    source(
      text(
        "Happy%20New%20Year",
        new TextStyle("AlexBrush-Regular.ttf", 50)
      ).textColor("white")
    ).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(30)
        .offsetY(30)
    )
  );
```

#### Custom font guidelines

* `.ttf`, `.otf` and `.woff2` font types are supported.
* Custom fonts must be uploaded as **raw, authenticated** files.
    > **TIP**:
>
> You can upload custom fonts via the Media Library by creating (or using an existing) signed [upload preset](upload_presets) where the **Delivery type** option in the preset is set as **Authenticated**. You can use this upload preset when uploading files to the Media Library by configuring it as the default **Media library upload preset** for **Raw** files.
>     ![Raw, authenticated upload preset](https://res.cloudinary.com/demo/image/upload/bo_1px_solid_gray/w_600/f_auto,dpr_2,q_auto/docs/raw_auth_text.png "width:600, with_code:false, with_url:false")
>     Alternatively, you can select the signed upload preset you create for custom fonts in the [Media Library upload widget](dam_upload_store_assets#media_library_upload_widget)'s **Advanced** settings while uploading assets, if that option is enabled for your account.
* If your custom font's public ID includes slashes, specify the public ID path using colons as separators. For example: `path1:path2:myfont.ttf`.
* Make sure to include the file extension when referencing the `public_id` of the raw file. The extension must be specified in lower-case letters.
* To make use of bold or italic font styles, upload separate font files for each emphasis style and specify the relevant file in the overlay transformation.
* A custom font is available only to the specific product environment where it was uploaded.
* Underscores are not supported in custom font names. When uploading the font as a raw file, make sure the `public_id` does not include an underscore.
* As with any asset you upload to Cloudinary, it is your responsibility to make sure you have the necessary license and redistribution rights for any custom fonts you use.

### Predefined text templates

Instead of specifying the styling parameters every time you need to dynamically add a text overlay to an asset, you can use the public ID of a text image created with the [`text` method of the upload API](image_upload_api_reference#text_method). The same styles that were used to create the text image will also be dynamically applied to the text overlay. The default text string of the text image is also used unless you provide a new text string, which can be useful if you don't want the text string to appear in the URL, or if the text string is very long.

For example, you can create a text image of "Sample text string" in 82 point, red, Roboto bold font, and the public ID of `sample_text_style` as follows:

```multi
|ruby
result = Cloudinary::Uploader
.text("Sample text string",
  public_id: "sample_text_style",
  font_family: "Roboto", 
  font_size: 82,
  font_color: "red",
  font_weight: "bold")

|php_2
$result = $cloudinary->uploadApi()
->text("Sample text string", [
	"public_id" => "sample_text_style",
	"font_family" => "Roboto", 
	"font_size" => 82,
	"font_color" => "red", 
	"font_weight" => "bold"]);

|python
result = cloudinary.uploader
.text("Sample text string",
  public_id = "sample_text_style",
  font_family = "Roboto", 
  font_size = 82,
  font_color = "red",
  font_weight = "bold")

|nodejs
cloudinary.v2.uploader
.text("Sample text string",
  { public_id: "sample_text_style",
	font_family: "Roboto", 
	font_size: 82,
	font_color: "red", 
	font_weight: "bold" })
.then(result=>console.log(result));
         
|java
result = cloudinary.uploader
.text("Sample text string",
  ObjectUtils.asMap(
    "public_id", "sample_text_style",
	"font_family", "Roboto",
	"font_size", 82,
	"font_color", "red",
	"font_weight", "bold"));

|csharp
var textParams = new TextParams("Sample text string"){
  PublicId = "sample_text_style",
  FontFamily = "Roboto",
  FontSize = 82,
  FontColor = "red",
  FontWeight= "bold"};
var textResult = cloudinary.Text(textParams); 

|go
resp, err := cld.Upload.Text(ctx, uploader.TextParams{
        Text: "Sample text string",
		PublicID:   "sample_text_style",
		FontFamily: "Roboto",
		FontSize:   82,
		FontColor:  "red",
		FontWeight: "bold"})

|swift
let params = CLDTextRequestParams()
  .setPublicId("sample_text_style")
  .setFontFamily("Roboto")
  .setFontSize("82")
  .setFontColor("red")
  .setFontWeight(.bold)
let result = cloudinary.createManagementApi().multi("Sample text string", params: params)

|curl
curl https://api.cloudinary.com/v1_1/demo/image/text -X POST --data 'text=Sample%20text%20string&public_id=sample_text_image&font_family=Roboto&font_size=42&font_color=red&font_weight=bold&timestamp=173719931&api_key=614335564976464&signature=a788d68f86a6f868af'

|cli
cld uploader text "Sample text string" public_id="sample_text_style" font_family="Roboto" font_size=82 font_color="red" font_weight="bold"
```

This is the resulting text image:

You can then use the `sample_text_style` style in your text overlay, as follows:

!['Stylish text' added to image](https://res.cloudinary.com/demo/image/upload/w_500/l_text:sample_text_style:Flowers/fl_layer_apply,g_south/flowers.jpg)

```nodejs
cloudinary.image("flowers.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {public_id: "sample_text_style", text: "Flowers"}},
  {flags: "layer_apply", gravity: "south"}
  ]})
```

```react
new CloudinaryImage("flowers.jpg")
  .resize(scale().width(500))
  .overlay(
    source(text("Flowers", "sample_text_style")).position(
      new Position().gravity(compass("south"))
    )
  );
```

```vue
new CloudinaryImage("flowers.jpg")
  .resize(scale().width(500))
  .overlay(
    source(text("Flowers", "sample_text_style")).position(
      new Position().gravity(compass("south"))
    )
  );
```

```angular
new CloudinaryImage("flowers.jpg")
  .resize(scale().width(500))
  .overlay(
    source(text("Flowers", "sample_text_style")).position(
      new Position().gravity(compass("south"))
    )
  );
```

```js
new CloudinaryImage("flowers.jpg")
  .resize(scale().width(500))
  .overlay(
    source(text("Flowers", "sample_text_style")).position(
      new Position().gravity(compass("south"))
    )
  );
```

```python
CloudinaryImage("flowers.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'public_id': "sample_text_style", 'text': "Flowers"}},
  {'flags': "layer_apply", 'gravity': "south"}
  ])
```

```php
(new ImageTag('flowers.jpg'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Flowers","sample_text_style"))
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::south()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().text("Flowers").publicId("sample_text_style")).chain()
  .flags("layer_apply").gravity("south")).imageTag("flowers.jpg");
```

```ruby
cl_image_tag("flowers.jpg", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {public_id: "sample_text_style", text: "Flowers"}},
  {flags: "layer_apply", gravity: "south"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().Text("Flowers").PublicId("sample_text_style")).Chain()
  .Flags("layer_apply").Gravity("south")).BuildImageTag("flowers.jpg")
```

```dart
cloudinary.image('flowers.jpg').transformation(Transformation()
	.addTransformation("w_500/l_text:sample_text_style:Flowers/fl_layer_apply,g_south"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:sample_text_style:Flowers").chain()
  .setFlags("layer_apply").setGravity("south")).generate("flowers.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().text("Flowers").publicId("sample_text_style")).chain()
  .flags("layer_apply").gravity("south")).generate("flowers.jpg");
```

```flutter
cloudinary.image('flowers.jpg').transformation(Transformation()
	.addTransformation("w_500/l_text:sample_text_style:Flowers/fl_layer_apply,g_south"));
```

```kotlin
cloudinary.image {
	publicId("flowers.jpg")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Flowers","sample_text_style")) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.south()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("flowers.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().text("Flowers").publicId("sample_text_style")},
  {flags: "layer_apply", gravity: "south"}
  ]})
```

```react_native
new CloudinaryImage("flowers.jpg")
  .resize(scale().width(500))
  .overlay(
    source(text("Flowers", "sample_text_style")).position(
      new Position().gravity(compass("south"))
    )
  );
```

!['Stylish text' added to video](https://res.cloudinary.com/demo/video/upload/w_500/l_text:sample_text_style:Flowers/fl_layer_apply,g_south/lotus_flower.mp4)

```nodejs
cloudinary.video("lotus_flower", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: {public_id: "sample_text_style", text: "Flowers"}},
  {flags: "layer_apply", gravity: "south"}
  ]})
```

```react
new CloudinaryVideo("lotus_flower.mp4")
  .resize(scale().width(500))
  .overlay(
    source(text("Flowers", "sample_text_style")).position(
      new Position().gravity(compass("south"))
    )
  );
```

```vue
new CloudinaryVideo("lotus_flower.mp4")
  .resize(scale().width(500))
  .overlay(
    source(text("Flowers", "sample_text_style")).position(
      new Position().gravity(compass("south"))
    )
  );
```

```angular
new CloudinaryVideo("lotus_flower.mp4")
  .resize(scale().width(500))
  .overlay(
    source(text("Flowers", "sample_text_style")).position(
      new Position().gravity(compass("south"))
    )
  );
```

```js
new CloudinaryVideo("lotus_flower.mp4")
  .resize(scale().width(500))
  .overlay(
    source(text("Flowers", "sample_text_style")).position(
      new Position().gravity(compass("south"))
    )
  );
```

```python
CloudinaryVideo("lotus_flower").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': {'public_id': "sample_text_style", 'text': "Flowers"}},
  {'flags': "layer_apply", 'gravity': "south"}
  ])
```

```php
(new VideoTag('lotus_flower.mp4'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::text("Flowers","sample_text_style"))
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::south()))
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().text("Flowers").publicId("sample_text_style")).chain()
  .flags("layer_apply").gravity("south")).videoTag("lotus_flower");
```

```ruby
cl_video_tag("lotus_flower", transformation: [
  {width: 500, crop: "scale"},
  {overlay: {public_id: "sample_text_style", text: "Flowers"}},
  {flags: "layer_apply", gravity: "south"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new TextLayer().Text("Flowers").PublicId("sample_text_style")).Chain()
  .Flags("layer_apply").Gravity("south")).BuildVideoTag("lotus_flower")
```

```dart
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("w_500/l_text:sample_text_style:Flowers/fl_layer_apply,g_south"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("text:sample_text_style:Flowers").chain()
  .setFlags("layer_apply").setGravity("south")).generate("lotus_flower.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new TextLayer().text("Flowers").publicId("sample_text_style")).chain()
  .flags("layer_apply").gravity("south")).resourceType("video").generate("lotus_flower.mp4");
```

```flutter
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("w_500/l_text:sample_text_style:Flowers/fl_layer_apply,g_south"));
```

```kotlin
cloudinary.video {
	publicId("lotus_flower.mp4")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.text("Flowers","sample_text_style")) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.south()))
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("lotus_flower", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.TextLayer().text("Flowers").publicId("sample_text_style")},
  {flags: "layer_apply", gravity: "south"}
  ]})
```

```react_native
new CloudinaryVideo("lotus_flower.mp4")
  .resize(scale().width(500))
  .overlay(
    source(text("Flowers", "sample_text_style")).position(
      new Position().gravity(compass("south"))
    )
  );
```

### Text layer flags

The text content for text layers is often supplied in real time by your application users or another external source. You may want to use the following flags to help handle these scenarios: 

* **fl_disallow_overflow**: As mentioned in [layer overflow behavior](#layer_overflow_behavior) above, you can control whether large image or text layers will result in expanding the size of the delivered asset using the `fl_no_overflow` flag. However, for text overlays, if you don't want long text to impact the expected delivery asset size, but an unexpected trim might risk cutting off essential text, you can apply the `fl_disallow_overflow` flag, which will cause URLs with overflowing text layers to fail and return a 400 (bad request) error that you can check for and handle in your application. For more details and examples, see [fl_no_overflow](transformation_reference#fl_no_overflow) and [fl_disallow_overflow](transformation_reference#fl_disallow_overflow) in the _Transformation Reference_.
* **fl_text_no_trim**: By default, text layers are tightly trimmed on all sides. In some cases, especially if you add a border around the text, or you are using a gravity for your text layer that might place the text too close to the edge of the layer behind it, you can use the `fl_text_no_trim` flag to add a small amount of padding around the text overlay string.  For example: 
  ![Text with padding](https://res.cloudinary.com/demo/image/upload/co_yellow,l_text:Arial_150:Flowers,fl_text_no_trim/bo_6px_solid_red/fl_layer_apply/flower.jpg "thumb: w_250")

```nodejs
cloudinary.image("flower.jpg", {transformation: [
  {color: "yellow", overlay: {font_family: "Arial", font_size: 150, text: "Flowers"}, flags: "text_no_trim"},
  {border: "6px_solid_red"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryImage("flower.jpg").overlay(
  source(
    text("Flowers", new TextStyle("Arial", 150))
      .textColor("yellow")
      .transformation(
        new Transformation().addFlag("text_no_trim").border(solid(6, "red"))
      )
  )
);
```

```vue
new CloudinaryImage("flower.jpg").overlay(
  source(
    text("Flowers", new TextStyle("Arial", 150))
      .textColor("yellow")
      .transformation(
        new Transformation().addFlag("text_no_trim").border(solid(6, "red"))
      )
  )
);
```

```angular
new CloudinaryImage("flower.jpg").overlay(
  source(
    text("Flowers", new TextStyle("Arial", 150))
      .textColor("yellow")
      .transformation(
        new Transformation().addFlag("text_no_trim").border(solid(6, "red"))
      )
  )
);
```

```js
new CloudinaryImage("flower.jpg").overlay(
  source(
    text("Flowers", new TextStyle("Arial", 150))
      .textColor("yellow")
      .transformation(
        new Transformation().addFlag("text_no_trim").border(solid(6, "red"))
      )
  )
);
```

```python
CloudinaryImage("flower.jpg").image(transformation=[
  {'color': "yellow", 'overlay': {'font_family': "Arial", 'font_size': 150, 'text': "Flowers"}, 'flags': "text_no_trim"},
  {'border': "6px_solid_red"},
  {'flags': "layer_apply"}
  ])
```

```php
(new ImageTag('flower.jpg'))
	->overlay(Overlay::source(
	Source::text("Flowers",(new TextStyle("Arial",150)))
	->textColor(Color::YELLOW)
	->transformation((new Transformation())
	->addFlag(
	Flag::textNoTrim())
	->border(Border::solid(6,Color::RED)))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .color("yellow").overlay(new TextLayer().fontFamily("Arial").fontSize(150).text("Flowers")).flags("text_no_trim").chain()
  .border("6px_solid_red").chain()
  .flags("layer_apply")).imageTag("flower.jpg");
```

```ruby
cl_image_tag("flower.jpg", transformation: [
  {color: "yellow", overlay: {font_family: "Arial", font_size: 150, text: "Flowers"}, flags: "text_no_trim"},
  {border: "6px_solid_red"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Color("yellow").Overlay(new TextLayer().FontFamily("Arial").FontSize(150).Text("Flowers")).Flags("text_no_trim").Chain()
  .Border("6px_solid_red").Chain()
  .Flags("layer_apply")).BuildImageTag("flower.jpg")
```

```dart
cloudinary.image('flower.jpg').transformation(Transformation()
	.addTransformation("co_yellow,l_text:Arial_150:Flowers,fl_text_no_trim/bo_6px_solid_red/fl_layer_apply"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setColor("yellow").setOverlay("text:Arial_150:Flowers").setFlags("text_no_trim").chain()
  .setBorder("6px_solid_red").chain()
  .setFlags("layer_apply")).generate("flower.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .color("yellow").overlay(new TextLayer().fontFamily("Arial").fontSize(150).text("Flowers")).flags("text_no_trim").chain()
  .border("6px_solid_red").chain()
  .flags("layer_apply")).generate("flower.jpg");
```

```flutter
cloudinary.image('flower.jpg').transformation(Transformation()
	.addTransformation("co_yellow,l_text:Arial_150:Flowers,fl_text_no_trim/bo_6px_solid_red/fl_layer_apply"));
```

```kotlin
cloudinary.image {
	publicId("flower.jpg")
	 overlay(Overlay.source(
	Source.text("Flowers",TextStyle("Arial",150)) {
	 textColor(Color.YELLOW)
	 transformation(Transformation {
	 addFlag(
	Flag.textNoTrim())
	 border(Border.solid(6,Color.RED)) })
	 })) 
}.generate()
```

```jquery
$.cloudinary.image("flower.jpg", {transformation: [
  {color: "yellow", overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(150).text("Flowers"), flags: "text_no_trim"},
  {border: "6px_solid_red"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryImage("flower.jpg").overlay(
  source(
    text("Flowers", new TextStyle("Arial", 150))
      .textColor("yellow")
      .transformation(
        new Transformation().addFlag("text_no_trim").border(solid(6, "red"))
      )
  )
);
```

  ![Text with padding](https://res.cloudinary.com/demo/video/upload/co_yellow,l_text:Arial_150:Flowers,fl_text_no_trim/bo_6px_solid_red/fl_layer_apply/lotus_flower.mp4 "thumb: w_250")

```nodejs
cloudinary.video("lotus_flower", {transformation: [
  {color: "yellow", overlay: {font_family: "Arial", font_size: 150, text: "Flowers"}, flags: "text_no_trim"},
  {border: "6px_solid_red"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryVideo("lotus_flower.mp4").overlay(
  source(
    text("Flowers", new TextStyle("Arial", 150))
      .textColor("yellow")
      .transformation(
        new Transformation().addFlag("text_no_trim").border(solid(6, "red"))
      )
  )
);
```

```vue
new CloudinaryVideo("lotus_flower.mp4").overlay(
  source(
    text("Flowers", new TextStyle("Arial", 150))
      .textColor("yellow")
      .transformation(
        new Transformation().addFlag("text_no_trim").border(solid(6, "red"))
      )
  )
);
```

```angular
new CloudinaryVideo("lotus_flower.mp4").overlay(
  source(
    text("Flowers", new TextStyle("Arial", 150))
      .textColor("yellow")
      .transformation(
        new Transformation().addFlag("text_no_trim").border(solid(6, "red"))
      )
  )
);
```

```js
new CloudinaryVideo("lotus_flower.mp4").overlay(
  source(
    text("Flowers", new TextStyle("Arial", 150))
      .textColor("yellow")
      .transformation(
        new Transformation().addFlag("text_no_trim").border(solid(6, "red"))
      )
  )
);
```

```python
CloudinaryVideo("lotus_flower").video(transformation=[
  {'color': "yellow", 'overlay': {'font_family': "Arial", 'font_size': 150, 'text': "Flowers"}, 'flags': "text_no_trim"},
  {'border': "6px_solid_red"},
  {'flags': "layer_apply"}
  ])
```

```php
(new VideoTag('lotus_flower.mp4'))
	->overlay(Overlay::source(
	Source::text("Flowers",(new TextStyle("Arial",150)))
	->textColor(Color::YELLOW)
	->transformation((new Transformation())
	->addFlag(
	Flag::textNoTrim())
	->border(Border::solid(6,Color::RED)))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .color("yellow").overlay(new TextLayer().fontFamily("Arial").fontSize(150).text("Flowers")).flags("text_no_trim").chain()
  .border("6px_solid_red").chain()
  .flags("layer_apply")).videoTag("lotus_flower");
```

```ruby
cl_video_tag("lotus_flower", transformation: [
  {color: "yellow", overlay: {font_family: "Arial", font_size: 150, text: "Flowers"}, flags: "text_no_trim"},
  {border: "6px_solid_red"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Color("yellow").Overlay(new TextLayer().FontFamily("Arial").FontSize(150).Text("Flowers")).Flags("text_no_trim").Chain()
  .Border("6px_solid_red").Chain()
  .Flags("layer_apply")).BuildVideoTag("lotus_flower")
```

```dart
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("co_yellow,l_text:Arial_150:Flowers,fl_text_no_trim/bo_6px_solid_red/fl_layer_apply"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setColor("yellow").setOverlay("text:Arial_150:Flowers").setFlags("text_no_trim").chain()
  .setBorder("6px_solid_red").chain()
  .setFlags("layer_apply")).generate("lotus_flower.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .color("yellow").overlay(new TextLayer().fontFamily("Arial").fontSize(150).text("Flowers")).flags("text_no_trim").chain()
  .border("6px_solid_red").chain()
  .flags("layer_apply")).resourceType("video").generate("lotus_flower.mp4");
```

```flutter
cloudinary.video('lotus_flower.mp4').transformation(Transformation()
	.addTransformation("co_yellow,l_text:Arial_150:Flowers,fl_text_no_trim/bo_6px_solid_red/fl_layer_apply"));
```

```kotlin
cloudinary.video {
	publicId("lotus_flower.mp4")
	 overlay(Overlay.source(
	Source.text("Flowers",TextStyle("Arial",150)) {
	 textColor(Color.YELLOW)
	 transformation(Transformation {
	 addFlag(
	Flag.textNoTrim())
	 border(Border.solid(6,Color.RED)) })
	 })) 
}.generate()
```

```jquery
$.cloudinary.video("lotus_flower", {transformation: [
  {color: "yellow", overlay: new cloudinary.TextLayer().fontFamily("Arial").fontSize(150).text("Flowers"), flags: "text_no_trim"},
  {border: "6px_solid_red"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryVideo("lotus_flower.mp4").overlay(
  source(
    text("Flowers", new TextStyle("Arial", 150))
      .textColor("yellow")
      .transformation(
        new Transformation().addFlag("text_no_trim").border(solid(6, "red"))
      )
  )
);
```

> **NOTE**: When placing a background behind text overlays (e.g., `l_text:Arial_100:Flowers,b_green`), Cloudinary automatically adds this padding, so this padding flag isn't necessary.

## Image underlays
Add an underlay image under a partially transparent base image with the `underlay` parameter (`u` in URLs) and the public ID of a previously uploaded image (e.g., `u_background` for an image with the public ID of `background`), with the following general syntax.

```
u_<public_id of layer>/<optional layer transformations>/fl_layer_apply,<optional placement qualifiers>
```

You can determine the dimension of the underlay using width and height, and adjust the location of the base image over the underlay using the gravity parameter and the x and y parameters. The underlay can also be [further transformed](transformation_reference) like any other image uploaded to Cloudinary, and the underlay parameter supports the same features as for overlays as described above.

For example, add an underlay of an image called `site_bg` to the base image. The underlay and base image are both resized to the same width and height, and the brightness is increased to 100 using the brightness effect (`c_fill,h_200,w_200/u_site_bg/c_scale,h_200,w_200/e_brightness:100/fl_layer_apply`):

![Image with underlay](https://res.cloudinary.com/demo/image/upload/c_fill,h_200,w_200/u_site_bg/c_scale,h_200,w_200/e_brightness:100/fl_layer_apply/smartphone.png)

```nodejs
cloudinary.image("smartphone.png", {transformation: [
  {height: 200, width: 200, crop: "fill"},
  {underlay: "site_bg"},
  {height: 200, width: 200, crop: "scale"},
  {effect: "brightness:100"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryImage("smartphone.png")
  .resize(fill().width(200).height(200))
  .underlay(
    source(
      image("site_bg").transformation(
        new Transformation()
          .resize(scale().width(200).height(200))
          .adjust(brightness().level(100))
      )
    )
  );
```

```vue
new CloudinaryImage("smartphone.png")
  .resize(fill().width(200).height(200))
  .underlay(
    source(
      image("site_bg").transformation(
        new Transformation()
          .resize(scale().width(200).height(200))
          .adjust(brightness().level(100))
      )
    )
  );
```

```angular
new CloudinaryImage("smartphone.png")
  .resize(fill().width(200).height(200))
  .underlay(
    source(
      image("site_bg").transformation(
        new Transformation()
          .resize(scale().width(200).height(200))
          .adjust(brightness().level(100))
      )
    )
  );
```

```js
new CloudinaryImage("smartphone.png")
  .resize(fill().width(200).height(200))
  .underlay(
    source(
      image("site_bg").transformation(
        new Transformation()
          .resize(scale().width(200).height(200))
          .adjust(brightness().level(100))
      )
    )
  );
```

```python
CloudinaryImage("smartphone.png").image(transformation=[
  {'height': 200, 'width': 200, 'crop': "fill"},
  {'underlay': "site_bg"},
  {'height': 200, 'width': 200, 'crop': "scale"},
  {'effect': "brightness:100"},
  {'flags': "layer_apply"}
  ])
```

```php
(new ImageTag('smartphone.png'))
	->resize(Resize::fill()->width(200)
->height(200))
	->underlay(Underlay::source(
	Source::image("site_bg")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(200)
->height(200))
	->adjust(Adjust::brightness()->level(100)))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .height(200).width(200).crop("fill").chain()
  .underlay(new Layer().publicId("site_bg")).chain()
  .height(200).width(200).crop("scale").chain()
  .effect("brightness:100").chain()
  .flags("layer_apply")).imageTag("smartphone.png");
```

```ruby
cl_image_tag("smartphone.png", transformation: [
  {height: 200, width: 200, crop: "fill"},
  {underlay: "site_bg"},
  {height: 200, width: 200, crop: "scale"},
  {effect: "brightness:100"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Height(200).Width(200).Crop("fill").Chain()
  .Underlay(new Layer().PublicId("site_bg")).Chain()
  .Height(200).Width(200).Crop("scale").Chain()
  .Effect("brightness:100").Chain()
  .Flags("layer_apply")).BuildImageTag("smartphone.png")
```

```dart
cloudinary.image('smartphone.png').transformation(Transformation()
	.resize(Resize.fill().width(200)
.height(200))
	.underlay(Underlay.source(
	Source.image("site_bg")
	.transformation(new Transformation()
	.resize(Resize.scale().width(200)
.height(200))
	.adjust(Adjust.brightness().level(100)))
	)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setHeight(200).setWidth(200).setCrop("fill").chain()
  .setUnderlay("site_bg").chain()
  .setHeight(200).setWidth(200).setCrop("scale").chain()
  .setEffect("brightness:100").chain()
  .setFlags("layer_apply")).generate("smartphone.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .height(200).width(200).crop("fill").chain()
  .underlay(new Layer().publicId("site_bg")).chain()
  .height(200).width(200).crop("scale").chain()
  .effect("brightness:100").chain()
  .flags("layer_apply")).generate("smartphone.png");
```

```flutter
cloudinary.image('smartphone.png').transformation(Transformation()
	.resize(Resize.fill().width(200)
.height(200))
	.underlay(Underlay.source(
	Source.image("site_bg")
	.transformation(new Transformation()
	.resize(Resize.scale().width(200)
.height(200))
	.adjust(Adjust.brightness().level(100)))
	)));
```

```kotlin
cloudinary.image {
	publicId("smartphone.png")
	 resize(Resize.fill() { width(200)
 height(200) })
	 underlay(Underlay.source(
	Source.image("site_bg") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(200)
 height(200) })
	 adjust(Adjust.brightness() { level(100) }) })
	 })) 
}.generate()
```

```jquery
$.cloudinary.image("smartphone.png", {transformation: [
  {height: 200, width: 200, crop: "fill"},
  {underlay: new cloudinary.Layer().publicId("site_bg")},
  {height: 200, width: 200, crop: "scale"},
  {effect: "brightness:100"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryImage("smartphone.png")
  .resize(fill().width(200).height(200))
  .underlay(
    source(
      image("site_bg").transformation(
        new Transformation()
          .resize(scale().width(200).height(200))
          .adjust(brightness().level(100))
      )
    )
  );
```

![Video with underlay](https://res.cloudinary.com/demo/video/upload/c_fill,h_200,w_200/u_site_bg/c_scale,h_200,w_200/e_brightness:100/fl_layer_apply/docs/transparent_talking.webm)

```nodejs
cloudinary.video("docs/transparent_talking", {transformation: [
  {height: 200, width: 200, crop: "fill"},
  {underlay: "site_bg"},
  {height: 200, width: 200, crop: "scale"},
  {effect: "brightness:100"},
  {flags: "layer_apply"}
  ]})
```

```react
new CloudinaryVideo("docs/transparent_talking.webm")
  .resize(fill().width(200).height(200))
  .underlay(
    source(
      image("site_bg").transformation(
        new Transformation()
          .resize(scale().width(200).height(200))
          .adjust(brightness().level(100))
      )
    )
  );
```

```vue
new CloudinaryVideo("docs/transparent_talking.webm")
  .resize(fill().width(200).height(200))
  .underlay(
    source(
      image("site_bg").transformation(
        new Transformation()
          .resize(scale().width(200).height(200))
          .adjust(brightness().level(100))
      )
    )
  );
```

```angular
new CloudinaryVideo("docs/transparent_talking.webm")
  .resize(fill().width(200).height(200))
  .underlay(
    source(
      image("site_bg").transformation(
        new Transformation()
          .resize(scale().width(200).height(200))
          .adjust(brightness().level(100))
      )
    )
  );
```

```js
new CloudinaryVideo("docs/transparent_talking.webm")
  .resize(fill().width(200).height(200))
  .underlay(
    source(
      image("site_bg").transformation(
        new Transformation()
          .resize(scale().width(200).height(200))
          .adjust(brightness().level(100))
      )
    )
  );
```

```python
CloudinaryVideo("docs/transparent_talking").video(transformation=[
  {'height': 200, 'width': 200, 'crop': "fill"},
  {'underlay': "site_bg"},
  {'height': 200, 'width': 200, 'crop': "scale"},
  {'effect': "brightness:100"},
  {'flags': "layer_apply"}
  ])
```

```php
(new VideoTag('docs/transparent_talking.webm'))
	->resize(Resize::fill()->width(200)
->height(200))
	->underlay(Underlay::source(
	Source::image("site_bg")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(200)
->height(200))
	->adjust(Adjust::brightness()->level(100)))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .height(200).width(200).crop("fill").chain()
  .underlay(new Layer().publicId("site_bg")).chain()
  .height(200).width(200).crop("scale").chain()
  .effect("brightness:100").chain()
  .flags("layer_apply")).videoTag("docs/transparent_talking");
```

```ruby
cl_video_tag("docs/transparent_talking", transformation: [
  {height: 200, width: 200, crop: "fill"},
  {underlay: "site_bg"},
  {height: 200, width: 200, crop: "scale"},
  {effect: "brightness:100"},
  {flags: "layer_apply"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Height(200).Width(200).Crop("fill").Chain()
  .Underlay(new Layer().PublicId("site_bg")).Chain()
  .Height(200).Width(200).Crop("scale").Chain()
  .Effect("brightness:100").Chain()
  .Flags("layer_apply")).BuildVideoTag("docs/transparent_talking")
```

```dart
cloudinary.video('docs/transparent_talking.webm').transformation(Transformation()
	.resize(Resize.fill().width(200)
.height(200))
	.underlay(Underlay.source(
	Source.image("site_bg")
	.transformation(new Transformation()
	.resize(Resize.scale().width(200)
.height(200))
	.adjust(Adjust.brightness().level(100)))
	)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setHeight(200).setWidth(200).setCrop("fill").chain()
  .setUnderlay("site_bg").chain()
  .setHeight(200).setWidth(200).setCrop("scale").chain()
  .setEffect("brightness:100").chain()
  .setFlags("layer_apply")).generate("docs/transparent_talking.webm")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .height(200).width(200).crop("fill").chain()
  .underlay(new Layer().publicId("site_bg")).chain()
  .height(200).width(200).crop("scale").chain()
  .effect("brightness:100").chain()
  .flags("layer_apply")).resourceType("video").generate("docs/transparent_talking.webm");
```

```flutter
cloudinary.video('docs/transparent_talking.webm').transformation(Transformation()
	.resize(Resize.fill().width(200)
.height(200))
	.underlay(Underlay.source(
	Source.image("site_bg")
	.transformation(new Transformation()
	.resize(Resize.scale().width(200)
.height(200))
	.adjust(Adjust.brightness().level(100)))
	)));
```

```kotlin
cloudinary.video {
	publicId("docs/transparent_talking.webm")
	 resize(Resize.fill() { width(200)
 height(200) })
	 underlay(Underlay.source(
	Source.image("site_bg") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(200)
 height(200) })
	 adjust(Adjust.brightness() { level(100) }) })
	 })) 
}.generate()
```

```jquery
$.cloudinary.video("docs/transparent_talking", {transformation: [
  {height: 200, width: 200, crop: "fill"},
  {underlay: new cloudinary.Layer().publicId("site_bg")},
  {height: 200, width: 200, crop: "scale"},
  {effect: "brightness:100"},
  {flags: "layer_apply"}
  ]})
```

```react_native
new CloudinaryVideo("docs/transparent_talking.webm")
  .resize(fill().width(200).height(200))
  .underlay(
    source(
      image("site_bg").transformation(
        new Transformation()
          .resize(scale().width(200).height(200))
          .adjust(brightness().level(100))
      )
    )
  );
```

> **NOTE**: If the public ID of an image includes slashes (e.g., the public ID of an image is `layers/blue`), replace the slashes with colons when using the image as an underlay (e.g., the public ID of the image becomes `layers:blue` when used as an underlay).

**See full syntax**: [u_\<image id\>](transformation_reference#u_image_id) in the _Transformation Reference_.

### Remote image underlays

Similar to [overlaying a remote image](#remote_image_overlays), you can underlay a remote image using `u_fetch:<base64 encoded URL>`.

For example, add the background image, `https://res.cloudinary.com/demo/image/upload/site_bg` (base64 encoded: `aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==`), as an underlay, resized to match the size of the base image (`u_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==/c_fill,fl_layer_apply,fl_relative,h_1.0,w_1.0`):

![Fetched image underlay resized to match base image](https://res.cloudinary.com/demo/image/upload/u_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==/c_fill,fl_layer_apply,fl_relative,h_1.0,w_1.0/smartphone.png "thumb: h_150")

```nodejs
cloudinary.image("smartphone.png", {transformation: [
  {underlay: {url: "https://res.cloudinary.com/demo/image/upload/site_bg"}},
  {flags: ["layer_apply", "relative"], height: "1.0", width: "1.0", crop: "fill"}
  ]})
```

```react
new CloudinaryImage("smartphone.png").underlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/site_bg"
    ).transformation(
      new Transformation().resize(fill().width("1.0").height("1.0").relative())
    )
  )
);
```

```vue
new CloudinaryImage("smartphone.png").underlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/site_bg"
    ).transformation(
      new Transformation().resize(fill().width("1.0").height("1.0").relative())
    )
  )
);
```

```angular
new CloudinaryImage("smartphone.png").underlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/site_bg"
    ).transformation(
      new Transformation().resize(fill().width("1.0").height("1.0").relative())
    )
  )
);
```

```js
new CloudinaryImage("smartphone.png").underlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/site_bg"
    ).transformation(
      new Transformation().resize(fill().width("1.0").height("1.0").relative())
    )
  )
);
```

```python
CloudinaryImage("smartphone.png").image(transformation=[
  {'underlay': {'url': "https://res.cloudinary.com/demo/image/upload/site_bg"}},
  {'flags': ["layer_apply", "relative"], 'height': "1.0", 'width': "1.0", 'crop': "fill"}
  ])
```

```php
(new ImageTag('smartphone.png'))
	->underlay(Underlay::source(
	Source::fetch("https://res.cloudinary.com/demo/image/upload/site_bg")
	->transformation((new Transformation())
	->resize(Resize::fill()->width(1.0)
->height(1.0)
	->relative()
	))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .underlay(new FetchLayer().url("https://res.cloudinary.com/demo/image/upload/site_bg")).chain()
  .flags("layer_apply", "relative").height(1.0).width(1.0).crop("fill")).imageTag("smartphone.png");
```

```ruby
cl_image_tag("smartphone.png", transformation: [
  {underlay: {url: "https://res.cloudinary.com/demo/image/upload/site_bg"}},
  {flags: ["layer_apply", "relative"], height: 1.0, width: 1.0, crop: "fill"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Underlay(new FetchLayer("https://res.cloudinary.com/demo/image/upload/site_bg")).Chain()
  .Flags("layer_apply", "relative").Height(1.0).Width(1.0).Crop("fill")).BuildImageTag("smartphone.png")
```

```dart
cloudinary.image('smartphone.png').transformation(Transformation()
	.underlay(Underlay.source(
	Source.fetch("https://res.cloudinary.com/demo/image/upload/site_bg")
	.transformation(new Transformation()
	.resize(Resize.fill().width('1.0')
.height('1.0')
	.relative()
	))
	)));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setUnderlay("fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==").chain()
  .setFlags("layer_apply", "relative").setHeight(1.0).setWidth(1.0).setCrop("fill")).generate("smartphone.png")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .underlay(new FetchLayer().url("https://res.cloudinary.com/demo/image/upload/site_bg")).chain()
  .flags("layer_apply", "relative").height(1.0).width(1.0).crop("fill")).generate("smartphone.png");
```

```flutter
cloudinary.image('smartphone.png').transformation(Transformation()
	.underlay(Underlay.source(
	Source.fetch("https://res.cloudinary.com/demo/image/upload/site_bg")
	.transformation(new Transformation()
	.resize(Resize.fill().width('1.0')
.height('1.0')
	.relative()
	))
	)));
```

```kotlin
cloudinary.image {
	publicId("smartphone.png")
	 underlay(Underlay.source(
	Source.fetch("https://res.cloudinary.com/demo/image/upload/site_bg") {
	 transformation(Transformation {
	 resize(Resize.fill() { width(1.0F)
 height(1.0F)
	 relative()
	 }) })
	 })) 
}.generate()
```

```jquery
$.cloudinary.image("smartphone.png", {transformation: [
  {underlay: new cloudinary.FetchLayer().url("https://res.cloudinary.com/demo/image/upload/site_bg")},
  {flags: ["layer_apply", "relative"], height: "1.0", width: "1.0", crop: "fill"}
  ]})
```

```react_native
new CloudinaryImage("smartphone.png").underlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/site_bg"
    ).transformation(
      new Transformation().resize(fill().width("1.0").height("1.0").relative())
    )
  )
);
```

![Fetched image underlay resized to match base video](https://res.cloudinary.com/demo/video/upload/u_fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==/c_fill,fl_layer_apply,fl_relative,h_1.0,w_1.0/docs/transparent_talking.webm "thumb: h_150")

```nodejs
cloudinary.video("docs/transparent_talking", {transformation: [
  {underlay: {url: "https://res.cloudinary.com/demo/image/upload/site_bg"}},
  {flags: ["layer_apply", "relative"], height: "1.0", width: "1.0", crop: "fill"}
  ]})
```

```react
new CloudinaryVideo("docs/transparent_talking.webm").underlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/site_bg"
    ).transformation(
      new Transformation().resize(fill().width("1.0").height("1.0").relative())
    )
  )
);
```

```vue
new CloudinaryVideo("docs/transparent_talking.webm").underlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/site_bg"
    ).transformation(
      new Transformation().resize(fill().width("1.0").height("1.0").relative())
    )
  )
);
```

```angular
new CloudinaryVideo("docs/transparent_talking.webm").underlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/site_bg"
    ).transformation(
      new Transformation().resize(fill().width("1.0").height("1.0").relative())
    )
  )
);
```

```js
new CloudinaryVideo("docs/transparent_talking.webm").underlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/site_bg"
    ).transformation(
      new Transformation().resize(fill().width("1.0").height("1.0").relative())
    )
  )
);
```

```python
CloudinaryVideo("docs/transparent_talking").video(transformation=[
  {'underlay': {'url': "https://res.cloudinary.com/demo/image/upload/site_bg"}},
  {'flags': ["layer_apply", "relative"], 'height': "1.0", 'width': "1.0", 'crop': "fill"}
  ])
```

```php
(new VideoTag('docs/transparent_talking.webm'))
	->underlay(Underlay::source(
	Source::fetch("https://res.cloudinary.com/demo/image/upload/site_bg")
	->transformation((new Transformation())
	->resize(Resize::fill()->width(1.0)
->height(1.0)
	->relative()
	))
	));
```

```java
cloudinary.url().transformation(new Transformation()
  .underlay(new FetchLayer().url("https://res.cloudinary.com/demo/image/upload/site_bg")).chain()
  .flags("layer_apply", "relative").height(1.0).width(1.0).crop("fill")).videoTag("docs/transparent_talking");
```

```ruby
cl_video_tag("docs/transparent_talking", transformation: [
  {underlay: {url: "https://res.cloudinary.com/demo/image/upload/site_bg"}},
  {flags: ["layer_apply", "relative"], height: 1.0, width: 1.0, crop: "fill"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Underlay(new FetchLayer("https://res.cloudinary.com/demo/image/upload/site_bg")).Chain()
  .Flags("layer_apply", "relative").Height(1.0).Width(1.0).Crop("fill")).BuildVideoTag("docs/transparent_talking")
```

```dart
cloudinary.video('docs/transparent_talking.webm').transformation(Transformation()
	.underlay(Underlay.source(
	Source.fetch("https://res.cloudinary.com/demo/image/upload/site_bg")
	.transformation(new Transformation()
	.resize(Resize.fill().width('1.0')
.height('1.0')
	.relative()
	))
	)));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setUnderlay("fetch:aHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvc2l0ZV9iZw==").chain()
  .setFlags("layer_apply", "relative").setHeight(1.0).setWidth(1.0).setCrop("fill")).generate("docs/transparent_talking.webm")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .underlay(new FetchLayer().url("https://res.cloudinary.com/demo/image/upload/site_bg")).chain()
  .flags("layer_apply", "relative").height(1.0).width(1.0).crop("fill")).resourceType("video").generate("docs/transparent_talking.webm");
```

```flutter
cloudinary.video('docs/transparent_talking.webm').transformation(Transformation()
	.underlay(Underlay.source(
	Source.fetch("https://res.cloudinary.com/demo/image/upload/site_bg")
	.transformation(new Transformation()
	.resize(Resize.fill().width('1.0')
.height('1.0')
	.relative()
	))
	)));
```

```kotlin
cloudinary.video {
	publicId("docs/transparent_talking.webm")
	 underlay(Underlay.source(
	Source.fetch("https://res.cloudinary.com/demo/image/upload/site_bg") {
	 transformation(Transformation {
	 resize(Resize.fill() { width(1.0F)
 height(1.0F)
	 relative()
	 }) })
	 })) 
}.generate()
```

```jquery
$.cloudinary.video("docs/transparent_talking", {transformation: [
  {underlay: new cloudinary.FetchLayer().url("https://res.cloudinary.com/demo/image/upload/site_bg")},
  {flags: ["layer_apply", "relative"], height: "1.0", width: "1.0", crop: "fill"}
  ]})
```

```react_native
new CloudinaryVideo("docs/transparent_talking.webm").underlay(
  source(
    fetch(
      "https://res.cloudinary.com/demo/image/upload/site_bg"
    ).transformation(
      new Transformation().resize(fill().width("1.0").height("1.0").relative())
    )
  )
);
```

> **NOTE**: The Cloudinary SDKs automatically generate a base64 encoded URL for a given HTTP/S URL, but if you generate the delivery URL in your own code, then you'll need to supply the fetch URL in base64 encoding with padding.

**See full syntax**: [u_fetch](transformation_reference#u_fetch) in the _Transformation Reference_.

## Watermarking

You can use a standard image layer for the purpose of applying a watermark to any delivered image. [Opacity](transformation_reference#o_opacity) and/or [brightness](transformation_reference#e_brightness) transformations are often applied to image layers when they are used as a watermark.

You can also use automatic tiling and/or the smart anti-removal effect with your layer transformation in order to achieve your watermark requirements.

### Automatic tiling

Instead of adding your watermark layer to a single, specific location, you can tile layer image over the entire base image by adding the `tiled` qualifier (`fl_tiled` in URLs). The `tiled` flag is added in the same component as the `layer_apply` flag. For example, tiling an overlay of the image called `cloudinary_icon_white` on to the base image (`l_cloudinary_icon_white/fl_layer_apply,fl_tiled`):

![Image with tiled overlay](https://res.cloudinary.com/demo/image/upload/l_cloudinary_icon_white/fl_layer_apply,fl_tiled/leather_bag.jpg "thumb: w_400")

```nodejs
cloudinary.image("leather_bag.jpg", {transformation: [
  {overlay: "cloudinary_icon_white"},
  {flags: ["layer_apply", "tiled"]}
  ]})
```

```react
new CloudinaryImage("leather_bag.jpg").overlay(
  source(image("cloudinary_icon_white")).position(new Position().tiled())
);
```

```vue
new CloudinaryImage("leather_bag.jpg").overlay(
  source(image("cloudinary_icon_white")).position(new Position().tiled())
);
```

```angular
new CloudinaryImage("leather_bag.jpg").overlay(
  source(image("cloudinary_icon_white")).position(new Position().tiled())
);
```

```js
new CloudinaryImage("leather_bag.jpg").overlay(
  source(image("cloudinary_icon_white")).position(new Position().tiled())
);
```

```python
CloudinaryImage("leather_bag.jpg").image(transformation=[
  {'overlay': "cloudinary_icon_white"},
  {'flags': ["layer_apply", "tiled"]}
  ])
```

```php
(new ImageTag('leather_bag.jpg'))
	->overlay(Overlay::source(
	Source::image("cloudinary_icon_white"))
	->position((new Position())
	->tiled()
	)
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .overlay(new Layer().publicId("cloudinary_icon_white")).chain()
  .flags("layer_apply", "tiled")).imageTag("leather_bag.jpg");
```

```ruby
cl_image_tag("leather_bag.jpg", transformation: [
  {overlay: "cloudinary_icon_white"},
  {flags: ["layer_apply", "tiled"]}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Overlay(new Layer().PublicId("cloudinary_icon_white")).Chain()
  .Flags("layer_apply", "tiled")).BuildImageTag("leather_bag.jpg")
```

```dart
cloudinary.image('leather_bag.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("cloudinary_icon_white"))
	.position(Position()
	.tiled()
	)
	));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setOverlay("cloudinary_icon_white").chain()
  .setFlags("layer_apply", "tiled")).generate("leather_bag.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .overlay(new Layer().publicId("cloudinary_icon_white")).chain()
  .flags("layer_apply", "tiled")).generate("leather_bag.jpg");
```

```flutter
cloudinary.image('leather_bag.jpg').transformation(Transformation()
	.overlay(Overlay.source(
	Source.image("cloudinary_icon_white"))
	.position(Position()
	.tiled()
	)
	));
```

```kotlin
cloudinary.image {
	publicId("leather_bag.jpg")
	 overlay(Overlay.source(
	Source.image("cloudinary_icon_white")) {
	 position(Position() {
	 tiled()
	 })
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("leather_bag.jpg", {transformation: [
  {overlay: new cloudinary.Layer().publicId("cloudinary_icon_white")},
  {flags: ["layer_apply", "tiled"]}
  ]})
```

```react_native
new CloudinaryImage("leather_bag.jpg").overlay(
  source(image("cloudinary_icon_white")).position(new Position().tiled())
);
```

### Smart anti-removal 
You can use the anti-removal effect (`e_anti_removal` in URLs) to slightly modify image overlays in a random manner, thus making them much harder to remove (e.g., adding your logo as a watermark to assets). In most cases, the default level of modification is designed to be visually hard to notice, but still difficult to remove cleanly. If needed, you can optionally control the level of distortion that this transformation applies by adding a colon followed by an integer (the higher the number, the more the image is distorted). The `anti_removal` effect is added in the same component as the `layer_apply` flag.

For example, adding the anti-removal effect (with a high level of 90 for demonstration purposes) to an overlay of the image called `cloudinary_icon_blue` added to the north-east corner of the base asset, with the overlay's opacity set to 50% and scaled to a width of 150 pixels (`c_scale,w_500/l_cloudinary_icon_blue/c_scale,w_150/o_50/e_anti_removal:90,fl_layer_apply,g_north_east`):

![Image with anti-removal overlay](https://res.cloudinary.com/demo/image/upload/c_scale,w_500/l_cloudinary_icon_blue/c_scale,w_150/o_50/e_anti_removal:90,fl_layer_apply,g_north_east/leather_bag_gray.jpg)

```nodejs
cloudinary.image("leather_bag_gray.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: "cloudinary_icon_blue"},
  {width: 150, crop: "scale"},
  {opacity: 50},
  {effect: "anti_removal:90", flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react
new CloudinaryImage("leather_bag_gray.jpg").resize(scale().width(500)).overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation().resize(scale().width(150)).adjust(opacity(50))
    )
  )
    .position(new Position().gravity(compass("north_east")))
    .blendMode(antiRemoval(90))
);
```

```vue
new CloudinaryImage("leather_bag_gray.jpg").resize(scale().width(500)).overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation().resize(scale().width(150)).adjust(opacity(50))
    )
  )
    .position(new Position().gravity(compass("north_east")))
    .blendMode(antiRemoval(90))
);
```

```angular
new CloudinaryImage("leather_bag_gray.jpg").resize(scale().width(500)).overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation().resize(scale().width(150)).adjust(opacity(50))
    )
  )
    .position(new Position().gravity(compass("north_east")))
    .blendMode(antiRemoval(90))
);
```

```js
new CloudinaryImage("leather_bag_gray.jpg").resize(scale().width(500)).overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation().resize(scale().width(150)).adjust(opacity(50))
    )
  )
    .position(new Position().gravity(compass("north_east")))
    .blendMode(antiRemoval(90))
);
```

```python
CloudinaryImage("leather_bag_gray.jpg").image(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': "cloudinary_icon_blue"},
  {'width': 150, 'crop': "scale"},
  {'opacity': 50},
  {'effect': "anti_removal:90", 'flags': "layer_apply", 'gravity': "north_east"}
  ])
```

```php
(new ImageTag('leather_bag_gray.jpg'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::image("cloudinary_icon_blue")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(150))
	->adjust(Adjust::opacity(50)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northEast()))
	)
	->blendMode(
	BlendMode::antiRemoval(90))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new Layer().publicId("cloudinary_icon_blue")).chain()
  .width(150).crop("scale").chain()
  .opacity(50).chain()
  .effect("anti_removal:90").flags("layer_apply").gravity("north_east")).imageTag("leather_bag_gray.jpg");
```

```ruby
cl_image_tag("leather_bag_gray.jpg", transformation: [
  {width: 500, crop: "scale"},
  {overlay: "cloudinary_icon_blue"},
  {width: 150, crop: "scale"},
  {opacity: 50},
  {effect: "anti_removal:90", flags: "layer_apply", gravity: "north_east"}
  ])
```

```csharp
cloudinary.Api.UrlImgUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new Layer().PublicId("cloudinary_icon_blue")).Chain()
  .Width(150).Crop("scale").Chain()
  .Opacity(50).Chain()
  .Effect("anti_removal:90").Flags("layer_apply").Gravity("north_east")).BuildImageTag("leather_bag_gray.jpg")
```

```dart
cloudinary.image('leather_bag_gray.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_cloudinary_icon_blue/c_scale,w_150/o_50/e_anti_removal:90,fl_layer_apply,g_north_east"));
```

```swift
imageView.cldSetImage(cloudinary.createUrl().setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("cloudinary_icon_blue").chain()
  .setWidth(150).setCrop("scale").chain()
  .setOpacity(50).chain()
  .setEffect("anti_removal:90").setFlags("layer_apply").setGravity("north_east")).generate("leather_bag_gray.jpg")!, cloudinary: cloudinary)
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new Layer().publicId("cloudinary_icon_blue")).chain()
  .width(150).crop("scale").chain()
  .opacity(50).chain()
  .effect("anti_removal:90").flags("layer_apply").gravity("north_east")).generate("leather_bag_gray.jpg");
```

```flutter
cloudinary.image('leather_bag_gray.jpg').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_cloudinary_icon_blue/c_scale,w_150/o_50/e_anti_removal:90,fl_layer_apply,g_north_east"));
```

```kotlin
cloudinary.image {
	publicId("leather_bag_gray.jpg")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.image("cloudinary_icon_blue") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(150) })
	 adjust(Adjust.opacity(50)) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northEast()))
	 })
	 blendMode(
	BlendMode.antiRemoval(90))
	 }) 
}.generate()
```

```jquery
$.cloudinary.image("leather_bag_gray.jpg", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.Layer().publicId("cloudinary_icon_blue")},
  {width: 150, crop: "scale"},
  {opacity: 50},
  {effect: "anti_removal:90", flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react_native
new CloudinaryImage("leather_bag_gray.jpg").resize(scale().width(500)).overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation().resize(scale().width(150)).adjust(opacity(50))
    )
  )
    .position(new Position().gravity(compass("north_east")))
    .blendMode(antiRemoval(90))
);
```

![Video with anti-removal overlay](https://res.cloudinary.com/demo/video/upload/c_scale,w_500/l_cloudinary_icon_blue/c_scale,w_150/o_50/e_anti_removal:90,fl_layer_apply,g_north_east/old_camera.mp4)

```nodejs
cloudinary.video("old_camera", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: "cloudinary_icon_blue"},
  {width: 150, crop: "scale"},
  {opacity: 50},
  {effect: "anti_removal:90", flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react
new CloudinaryVideo("old_camera.mp4").resize(scale().width(500)).overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation().resize(scale().width(150)).adjust(opacity(50))
    )
  )
    .position(new Position().gravity(compass("north_east")))
    .blendMode(antiRemoval(90))
);
```

```vue
new CloudinaryVideo("old_camera.mp4").resize(scale().width(500)).overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation().resize(scale().width(150)).adjust(opacity(50))
    )
  )
    .position(new Position().gravity(compass("north_east")))
    .blendMode(antiRemoval(90))
);
```

```angular
new CloudinaryVideo("old_camera.mp4").resize(scale().width(500)).overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation().resize(scale().width(150)).adjust(opacity(50))
    )
  )
    .position(new Position().gravity(compass("north_east")))
    .blendMode(antiRemoval(90))
);
```

```js
new CloudinaryVideo("old_camera.mp4").resize(scale().width(500)).overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation().resize(scale().width(150)).adjust(opacity(50))
    )
  )
    .position(new Position().gravity(compass("north_east")))
    .blendMode(antiRemoval(90))
);
```

```python
CloudinaryVideo("old_camera").video(transformation=[
  {'width': 500, 'crop': "scale"},
  {'overlay': "cloudinary_icon_blue"},
  {'width': 150, 'crop': "scale"},
  {'opacity': 50},
  {'effect': "anti_removal:90", 'flags': "layer_apply", 'gravity': "north_east"}
  ])
```

```php
(new VideoTag('old_camera.mp4'))
	->resize(Resize::scale()->width(500))
	->overlay(Overlay::source(
	Source::image("cloudinary_icon_blue")
	->transformation((new Transformation())
	->resize(Resize::scale()->width(150))
	->adjust(Adjust::opacity(50)))
	)
	->position((new Position())
	->gravity(
	Gravity::compass(
	Compass::northEast()))
	)
	->blendMode(
	BlendMode::antiRemoval(90))
	);
```

```java
cloudinary.url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new Layer().publicId("cloudinary_icon_blue")).chain()
  .width(150).crop("scale").chain()
  .opacity(50).chain()
  .effect("anti_removal:90").flags("layer_apply").gravity("north_east")).videoTag("old_camera");
```

```ruby
cl_video_tag("old_camera", transformation: [
  {width: 500, crop: "scale"},
  {overlay: "cloudinary_icon_blue"},
  {width: 150, crop: "scale"},
  {opacity: 50},
  {effect: "anti_removal:90", flags: "layer_apply", gravity: "north_east"}
  ])
```

```csharp
cloudinary.Api.UrlVideoUp.Transform(new Transformation()
  .Width(500).Crop("scale").Chain()
  .Overlay(new Layer().PublicId("cloudinary_icon_blue")).Chain()
  .Width(150).Crop("scale").Chain()
  .Opacity(50).Chain()
  .Effect("anti_removal:90").Flags("layer_apply").Gravity("north_east")).BuildVideoTag("old_camera")
```

```dart
cloudinary.video('old_camera.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_cloudinary_icon_blue/c_scale,w_150/o_50/e_anti_removal:90,fl_layer_apply,g_north_east"));
```

```swift
cloudinary.createUrl().setResourceType("video").setTransformation(CLDTransformation()
  .setWidth(500).setCrop("scale").chain()
  .setOverlay("cloudinary_icon_blue").chain()
  .setWidth(150).setCrop("scale").chain()
  .setOpacity(50).chain()
  .setEffect("anti_removal:90").setFlags("layer_apply").setGravity("north_east")).generate("old_camera.mp4")
```

```android
MediaManager.get().url().transformation(new Transformation()
  .width(500).crop("scale").chain()
  .overlay(new Layer().publicId("cloudinary_icon_blue")).chain()
  .width(150).crop("scale").chain()
  .opacity(50).chain()
  .effect("anti_removal:90").flags("layer_apply").gravity("north_east")).resourceType("video").generate("old_camera.mp4");
```

```flutter
cloudinary.video('old_camera.mp4').transformation(Transformation()
	.addTransformation("c_scale,w_500/l_cloudinary_icon_blue/c_scale,w_150/o_50/e_anti_removal:90,fl_layer_apply,g_north_east"));
```

```kotlin
cloudinary.video {
	publicId("old_camera.mp4")
	 resize(Resize.scale() { width(500) })
	 overlay(Overlay.source(
	Source.image("cloudinary_icon_blue") {
	 transformation(Transformation {
	 resize(Resize.scale() { width(150) })
	 adjust(Adjust.opacity(50)) })
	 }) {
	 position(Position() {
	 gravity(
	Gravity.compass(
	Compass.northEast()))
	 })
	 blendMode(
	BlendMode.antiRemoval(90))
	 }) 
}.generate()
```

```jquery
$.cloudinary.video("old_camera", {transformation: [
  {width: 500, crop: "scale"},
  {overlay: new cloudinary.Layer().publicId("cloudinary_icon_blue")},
  {width: 150, crop: "scale"},
  {opacity: 50},
  {effect: "anti_removal:90", flags: "layer_apply", gravity: "north_east"}
  ]})
```

```react_native
new CloudinaryVideo("old_camera.mp4").resize(scale().width(500)).overlay(
  source(
    image("cloudinary_icon_blue").transformation(
      new Transformation().resize(scale().width(150)).adjust(opacity(50))
    )
  )
    .position(new Position().gravity(compass("north_east")))
    .blendMode(antiRemoval(90))
);
```

> **NOTE**: Adding this effect generates a different result for each derived image, even if the transformation is the same. For example, every transformation URL including an overlay and the anti-removal effect, where only the public_id of the base image is changed, will result in a slightly different overlay.

**See full syntax**: [e_anti_removal](transformation_reference#e_anti_removal) in the _Transformation Reference_.

## Special layer applications
In addition to the primary use of layers for placing other assets or text on the base image, some transformation features make use of the layer option to specify a public ID that will be applied to the base image in order to achieve a desired effect. The following features make use of the layer transformation parameter in a special way:

Feature | Description
---|---
[3D LUTs](effects_and_artistic_enhancements#3_color_dimension_luts_3d_luts) | 3-color-dimension lookup tables (3D LUTs) map the color space in a LUT layer to the color space in a base image.
[Displacement maps](effects_and_artistic_enhancements#displacement_maps) | Displace pixels in a base image based on the intensity of pixels in a displacement map layer image.
[Blending and masking layers](effects_and_artistic_enhancements#blending_and_masking_layers) | Effects that blend or mask a base image based on the pixels in a layer image.
[Shape cutouts](effects_and_artistic_enhancements#shape_cutouts) | Remove or keep areas of a base image based on the opaque shape in a layer image.
 

