![demo_pic](https://i.imgur.com/s0klKA3.jpg)

# **turkey**: an Amazon Mechanical Turk turn-key segment tool. 

Authors: 
* Yanfeng Liu (yanfengliux@gmail.com)
* Jay Carlson (jcarlson@unl.edu)

**turkey** lets you easily create a web UI on Amazon Mechanical Turk to crowd-source image annotation data. You can annotate images using dots, polygons, or links (lines), and you can optionally allow Turk workers to switch annotation modes.

## Configuring Amazon Turk to use turkey

Copy the contents of `Mturk.html` into the source code section when you create a custom HIT in the Amazon Turk Requester. After the HIT is created, simply **Publish Batch** with a CSV file of both image URIs and annotation modes that you provide. A sample CSV file may look like:

```
img_url,annotation_mode,classes
https://i.imgur.com/kcCSGTR.jpg, dot-polygon-link, house-person-car-dog
https://i.imgur.com/2yOma1u.jpg, polygon, house-person-car-dog
```

Here, we allow the worker to use **Polygon**, **Link** and **Dot** modes for annotating the first image, but only the **Polygon** mode for the second. The class labels that the user can choose from are **house**, **person**, **car**, and **dog**. The first item in the list will be the default option. 

## Testing without Turk
You can test the code before deploying it on MTurk by opening `localDemo.html` in your browser. This file is a lightweight wrapper that will load `MTurk.html` off GitHub, passing a sample image to it in the process.

## Directions for the worker
 * Click to draw points, polygon vertices, and links
 * The blue toggle button indicates the current mode
 * Press **CTRL+Z** to undo.
 * Press **C** to close polygon in polygon mode.
 * Press **Reset** to clear everything.
 * Dot mode indicates the location of the object with one click. 
 * Link mode indicates head (1st click) and tail (2nd click).
 * Polygon mode draws the segmentation mask of the object.