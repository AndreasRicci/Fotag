'use strict';

// Main entry point for our app
window.addEventListener("load", function () {
    var appContainer = document.getElementById("app-container");

    // Get our class modules
    var modelModule = createModelModule();
    var viewModule = createViewModule();

    // Create models
    var imageCollectionModel = modelModule.loadImageCollectionModel(); // Load last saved image collection model, if available
    imageCollectionModel.addListener(function (eventType, imageModelCollection, imageModel, eventDate) {
        modelModule.storeImageCollectionModel(imageCollectionModel); // Save changes as they are made
    });

    // Create views
    var imageCollectionView = new viewModule.ImageCollectionView();

    // Toolbar
    var toolbar = new viewModule.Toolbar();
    prependChild(toolbar.getElement(), appContainer);
    toolbar.container = appContainer.children[0];
    toolbar.addListener(function (toolbar, eventType, eventDate) {
        switch (eventType) {
            case LIST_VIEW:
                imageCollectionView.setToView(LIST_VIEW);

                break;
            case GRID_VIEW:
                imageCollectionView.setToView(GRID_VIEW);

                break;
            case RATING_CHANGE:
                imageCollectionView.filterByRating(toolbar.getCurrentRatingFilter());

                break;
            default:
                console.log("ERROR: Got unexpected event type '" + eventType + "' in main'");
        }
    });

    var fileChooser = new viewModule.FileChooser();
    imageCollectionView.imageRendererContainer.appendChild(fileChooser.getElement());
    fileChooser.container = imageCollectionView.imageRendererContainer.children[imageCollectionView.imageRendererContainer.children.length - 1];

    imageCollectionView.setImageCollectionModel(imageCollectionModel);
    appContainer.appendChild(imageCollectionView.getElement());
    imageCollectionView.container = appContainer.children[appContainer.children.length - 1];

    // Add images using the file chooser
    fileChooser.addListener(function (fileChooser, files, eventDate) {
        _.each(
            files,
            function (file) {
                var imageModel = new modelModule.ImageModel("images/" + file.name, file.lastModifiedDate, "Click and edit here to caption this.", 0);
                imageCollectionModel.addImageModel(imageModel);
            }
        );

        // Reset rating filter because we are adding new images
        toolbar.setRatingFilter(0);

        // Scroll to bottom of page (since that's where the "Add photos" button will now be, to add more)
        window.scrollTo(0, document.body.scrollHeight);
    });

    // Setup for full-screen overlay
    var fullScreenPhotoContainer = document.querySelector(".photo-full-screen");
    var hideFullScreen = function () {
        addClass(fullScreenPhotoContainer, HIDE_CLASS);
    };
    var fullScreenPhoto = fullScreenPhotoContainer.querySelector(".photo-crop");
    fullScreenPhoto.addEventListener("click", hideFullScreen);
    var fullScreenPhotoOverlay = fullScreenPhotoContainer.querySelector(".overlay");
    fullScreenPhotoOverlay.addEventListener("click", hideFullScreen);
});
