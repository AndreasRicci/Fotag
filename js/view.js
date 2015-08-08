'use strict';

// Global access - possibly remove if someone else works better and fits application constraints
var LIST_VIEW = 'LIST_VIEW';
var GRID_VIEW = 'GRID_VIEW';
var DEFAULT_VIEW = GRID_VIEW;
var RATING_CHANGE = 'RATING_CHANGE';
var DEFAULT_RATING_FILTER = 0;
var DEFAULT_CAPTION = "Click and type here to caption this.";
var STAR_EMPTY_CLASS = "icon-star-empty";
var STAR_FULL_CLASS = "icon-star-full";
var HIDE_CLASS = "hide";
var ACTIVE_CLASS = "active";

/**
 * A function that creates and returns all of the model classes and constants.
 */
function createViewModule() {

    /**
     * An object representing a DOM element that will render the given ImageModel object.
     */
    var ImageRenderer = function (imageModel) {
        var that = this;
        this.lastRatingFilter = 0;

        /**
         * Updates the DOM for the image and metadata
         */
        this.updateImage = function () {
            var model = that.model;
            var src = model.getPath();
            var filename = src.replace("images/", "");
            var caption = model.getCaption().trim();
            var modificiationDate = model.getModificationDate().toDateString();
            var rating = model.getRating();

            var ratingText = rating + " out of 5.";
            if (rating == 0) {
                ratingText = "Not yet rated."
            }

            var captionAltText = caption;
            if (caption.length == 0) {
                captionAltText = "No caption provided."
            }

            var alt = "Caption: " + captionAltText + " Filename: " + filename + " Last Modified On: " + modificiationDate + " Rated: " + ratingText;
            var title = alt;

            that.imgEle.src = src;
            that.imgEle.alt = alt;
            that.imgEle.title = title;
            that.captionEle.innerText = caption;
            that.captionEle.title = captionAltText;
            that.filenameEle.innerText = filename;
            that.filenameEle.title = filename;
            that.modificiationDateEle.innerText = modificiationDate;
            that.modificiationDateEle.title = modificiationDate;

            // Update ratings
            var stars = that.ratingContainerEle.querySelectorAll("span");
            for (var i = 0; i < 5; i++) {
                if (rating > i) {
                    addClass(stars[i], STAR_FULL_CLASS);
                    removeClass(stars[i], STAR_EMPTY_CLASS);
                } else {
                    addClass(stars[i], STAR_EMPTY_CLASS);
                    removeClass(stars[i], STAR_FULL_CLASS);
                }
            }

            // Show or hide based on rating
            that.filterByRating(that.lastRatingFilter);
        };

        /**
         * Handles ImageModel events.
         */
        this.handleImageModelEvent = function (imageModel, eventDate) {
            that.updateImage();
        };

        // Create the container from our template
        var template = document.getElementById("image-renderer-template");
        this.container = document.importNode(template.content, true);
        this.imgEle = this.container.querySelector(".photo");
        this.imgContainerEle = this.container.querySelector(".photo-crop")
        this.captionEle = this.container.querySelector(".photo-caption");
        this.filenameEle = this.container.querySelector(".photo-filename");
        this.modificiationDateEle = this.container.querySelector(".photo-modification-date");
        this.ratingContainerEle = this.container.querySelector(".photo-rating-container");

        this.setImageModel(imageModel);
        this.setToView(DEFAULT_VIEW);

        this.updateImage();

        // Allow rating
        var stars = that.ratingContainerEle.querySelectorAll("span");

        var removeRatingPreview = function () {
            for (var i = 0; i < 5; i++) {
                if (that.model.getRating() > i) {
                    addClass(stars[i], STAR_FULL_CLASS);
                    removeClass(stars[i], STAR_EMPTY_CLASS);
                } else {
                    addClass(stars[i], STAR_EMPTY_CLASS);
                    removeClass(stars[i], STAR_FULL_CLASS);
                }
            }
        };

        var showRatingPreview = function (rating) {
            for (var i = 0; i < 5; i++) {
                if (rating > i) {
                    addClass(stars[i], STAR_FULL_CLASS);
                    removeClass(stars[i], STAR_EMPTY_CLASS);
                } else {
                    addClass(stars[i], STAR_EMPTY_CLASS);
                    removeClass(stars[i], STAR_FULL_CLASS);
                }
            }
        };

        stars[0].addEventListener("click", function () {
            that.model.setRating(1);
        });
        stars[1].addEventListener("click", function () {
            that.model.setRating(2);
        });
        stars[2].addEventListener("click", function () {
            that.model.setRating(3);
        });
        stars[3].addEventListener("click", function () {
            that.model.setRating(4);
        });
        stars[4].addEventListener("click", function () {
            that.model.setRating(5);
        });

        for (var i = 0; i < 5; i++) {
            stars[i].addEventListener("mouseout", function () {
                removeRatingPreview();
            });
        }

        stars[0].addEventListener("mouseover", function () {
            showRatingPreview(1);
        });
        stars[1].addEventListener("mouseover", function () {
            showRatingPreview(2);
        });
        stars[2].addEventListener("mouseover", function () {
            showRatingPreview(3);
        });
        stars[3].addEventListener("mouseover", function () {
            showRatingPreview(4);
        });
        stars[4].addEventListener("mouseover", function () {
            showRatingPreview(5);
        });

        // Allow editing of the caption
        this.captionEle.addEventListener("blur", function () {
            that.model.setCaption(that.captionEle.innerText);
        });

        // Make "enter" blur, which triggers the saving to model (as does anything that "blurs" the input)
        this.captionEle.addEventListener("keypress", function (e) {
            var key = e.which || e.keyCode;
            if (key == 13) { // 13 is enter
                that.captionEle.blur();
            }
        });

        // Allow full-screen viewing
        this.imgContainerEle.addEventListener("click", function () {
            var fullScreenPhotoContainer = document.querySelector(".photo-full-screen");
            var img = fullScreenPhotoContainer.querySelector(".photo");
            img.src = that.getImageModel().getPath();
            removeClass(fullScreenPhotoContainer, HIDE_CLASS);
        });
    };

    _.extend(ImageRenderer.prototype, {

        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */
        getElement: function () {
            return this.container;
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function () {
            return this.model;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function (imageModel) {
            if (this.model === imageModel) return; // Nothing changed

            // Clean up anything related to the previous model
            this.removeModelEventListeners();

            this.model = imageModel;
            this.model.addListener(this.handleImageModelEvent);

            this.updateImage();
        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function (viewType) {
            if (!_.isString(viewType) || (viewType !== LIST_VIEW && viewType != GRID_VIEW)) {
                throw new Error("Invalid arguments supplied to ImageRenderer.setToView: " + JSON.stringify(arguments));
            }

            if (this.view === viewType) return; // Nothing changed

            this.view = viewType;
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function () {
            return this.view;
        },

        /**
         * Hides this image from the screen.
         */
        hide: function () {
            addClass(this.container, HIDE_CLASS);
        },

        /**
         * Shows this image on the screen.
         */
        show: function () {
            removeClass(this.container, HIDE_CLASS);
        },

        /**
         * Show or hide this image based on rating.
         */
        filterByRating: function (ratingFilter) {
            this.lastRatingFilter = ratingFilter;

            var rating = this.model.getRating();

            if (rating < ratingFilter) {
                this.hide();
            } else {
                this.show();
            }
        },

        /**
         * Removes all model event listeners
         */
        removeModelEventListeners: function () {
            if (this.model != null) {
                this.model.removeListener(this.handleImageModelEvent);
            }
        },

        /**
         * Akin to a destructor
         */
        removeSelf: function () {
            this.removeModelEventListeners();
            removeElement(this.container);
        }
    });

    /**
     * A factory is an object that creates other objects. In this case, this object will create
     * objects that fulfill the ImageRenderer class's contract defined above.
     */
    var ImageRendererFactory = function () {

    };

    _.extend(ImageRendererFactory.prototype, {

        /**
         * Creates a new ImageRenderer object for the given ImageModel
         */
        createImageRenderer: function (imageModel) {
            return new ImageRenderer(imageModel);
        }
    });

    /**
     * An object representing a DOM element that will render an ImageCollectionModel.
     * Multiple such objects can be created and added to the DOM (i.e., you shouldn't
     * assume there is only one ImageCollectionView that will ever be created).
     */
    var ImageCollectionView = function () {
        var that = this;

        /**
         * Handles ImageCollectionModel events.
         */
        this.handleImageCollectionModelEvent = function (eventType, imageModelCollection, imageModel, eventDate) {
            switch (eventType) {
                case IMAGE_META_DATA_CHANGED_EVENT:
                    // Nothing to do. ImageRenderer's listen for changes to their specific models.

                    break;
                case IMAGE_ADDED_TO_COLLECTION_EVENT:
                    that.addImageRendererForModel(imageModel);

                    break;
                case IMAGE_REMOVED_FROM_COLLECTION_EVENT:
                    that.removeImageRenderersForModel(imageModel);

                    break;
                default:
                    console.log("ERROR: Got unexpected event type '" + eventType + "' in ImageCollectionView.handleImageCollectionModelEvent'");
            }
        };

        this.imageCollectionModel = null;
        this.imageRendererFactory = new ImageRendererFactory();
        this.imageRenderers = [];
        this.lastRatingFilter = 0; // For filtering purposes

        // DOM element which contains this
        this.container = null;

        // Create the container from our template
        var template = document.getElementById("image-collection-template");
        this.container = document.importNode(template.content, true);
        this.imageRendererContainer = this.container.querySelector(".image-collection");

        this.setToView(DEFAULT_VIEW);
    };

    _.extend(ImageCollectionView.prototype, {
        /**
         * Returns an element that can be attached to the DOM to display the ImageCollectionModel
         * this object represents.
         */
        getElement: function () {
            return this.container;
        },

        /**
         * Gets the current ImageRendererFactory being used to create new ImageRenderer objects.
         */
        getImageRendererFactory: function () {
            return this.imageRendererFactory;
        },

        /**
         * Sets the ImageRendererFactory to use to render ImageModels. When a *new* factory is provided,
         * the ImageCollectionView should redo its entire presentation, replacing all of the old
         * ImageRenderer objects with new ImageRenderer objects produced by the factory.
         */
        setImageRendererFactory: function (imageRendererFactory) {
            if (!(imageRendererFactory instanceof ImageRendererFactory)) {
                throw new Error("Invalid arguments to ImageCollectionView.setImageRendererFactory: " + JSON.stringify(arguments));
            }

            if (this.imageRendererFactory === imageRendererFactory) return; // Nothing changed

            this.imageRendererFactory = imageRendererFactory;

            // Re-render all images in this collection
            for (var i = 0; i < this.imageRenderers.length; i++) {
                var model = this.imageRenderers[i].getImageModel();
                var view = this.imageRenderers[i].getCurrentView();

                this.imageRenderers[i].removeSelf();

                this.imageRenderers[i] = null;

                this.imageRenderers[i] = this.imageRendererFactory.createImageRenderer(model);
                this.imageRenderers[i].setToView(view);

                insertBeforeLastChild(this.imageRenderers[i].getElement(), this.imageRendererContainer);
                this.imageRenderers[i].container = this.imageRendererContainer.children[this.imageRendererContainer.children.length - 2];
            }
        },

        /**
         * Returns the ImageCollectionModel represented by this view.
         */
        getImageCollectionModel: function () {
            return this.imageCollectionModel;
        },

        /**
         * Sets the ImageCollectionModel to be represented by this view. When setting the ImageCollectionModel,
         * you should properly register/unregister listeners with the model, so you will be notified of
         * any changes to the given model.
         */
        setImageCollectionModel: function (imageCollectionModel) {
            if (this.imageCollectionModel === imageCollectionModel) return; // Nothing changed

            // Clean up anything related to the previous model
            if (this.imageCollectionModel != null) {
                this.imageCollectionModel.removeListener(this.handleImageCollectionModelEvent);
            }

            // Remove all images in this collection
            _.each(
                this.imageRenderers,
                function (imageRenderer) {
                    imageRenderer.removeSelf();
                }
            );
            this.imageRenderers = [];

            this.imageCollectionModel = imageCollectionModel;
            this.imageCollectionModel.addListener(this.handleImageCollectionModelEvent);

            // Render all images from the new model
            var that = this;
            _.each(
                this.imageCollectionModel.imageModels,
                function (imageModel) {
                    that.addImageRendererForModel(imageModel);
                }
            );
        },

        /**
         * Changes the presentation of the images to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW.
         */
        setToView: function (viewType) {
            if (!_.isString(viewType) || (viewType !== LIST_VIEW && viewType != GRID_VIEW)) {
                throw new Error("Invalid arguments supplied to ImageCollectionView.setToView: " + JSON.stringify(arguments));
            }

            if (this.view === viewType) return; // Nothing changed

            this.view = viewType;

            if (this.view === LIST_VIEW) {
                addClass(this.imageRendererContainer, "listView");
            } else {
                removeClass(this.imageRendererContainer, "listView");
            }

            // Update all images in this collection
            var that = this;
            _.each(
                this.imageRenderers,
                function (imageRenderer) {
                    imageRenderer.setToView(that.view);
                }
            );
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type is currently
         * being rendered.
         */
        getCurrentView: function () {
            return this.view;
        },

        /**
         * Only show items with rating >= ratingFilter.
         * @param ratingFilter An int [0 <= 5].
         */
        filterByRating: function (ratingFilter) {
            if (!(_.isNumber(ratingFilter) && ratingFilter >= 0 && ratingFilter <= 5)) throw new Error("Invalid arguments supplied to ImageCollectionView.filterByRating: " + JSON.stringify(arguments));

            this.lastRatingFilter = ratingFilter;

            // Hide images which don't meet the criteria to be shown
            _.each(
                this.imageRenderers,
                function (imageRenderer) {
                    imageRenderer.filterByRating(ratingFilter);
                }
            );
        },

        /**
         * Adds an image renderer to the collection for the given model.
         */
        addImageRendererForModel: function (imageModel) {
            var imageRenderer = this.imageRendererFactory.createImageRenderer(imageModel);
            imageRenderer.setToView(this.getCurrentView());
            this.imageRenderers.push(imageRenderer);

            insertBeforeLastChild(imageRenderer.getElement(), this.imageRendererContainer); // Insert before the add button
            imageRenderer.container = this.imageRendererContainer.children[this.imageRendererContainer.children.length - 2];
        },

        /**
         * Removes all new image renderer to the collection for the given model.
         */
        removeImageRenderersForModel: function (imageModel) {
            // First, delete all image renderers for the model
            _.each(
                this.imageRenderers,
                function (imageRenderer) {
                    if (imageRenderer.getImageModel() === imageModel) {
                        imageRenderer.removeSelf();
                    }
                }
            );

            // Second, remove references to all deleted rendererd
            this.imageRenderers = _.filter(this.imageRenderers,
                function (imageRenderer) {
                    return imageRenderer.getImageModel() !== imageModel;
                });
        }
    });

    /**
     * An object representing a DOM element that will render the toolbar to the screen.
     */
    var Toolbar = function () {
        var that = this;

        this.view = DEFAULT_VIEW;
        this.rating = DEFAULT_RATING_FILTER;

        // Event listeners
        this.listeners = [];

        // DOM element which contains this
        this.container = null;

        // Create the container from our template
        var template = document.getElementById("toolbar-template");
        this.container = document.importNode(template.content, true);
        this.controls = this.container.querySelector(".controls");

        // View buttons
        this.gridButton = this.controls.querySelector(".grid");
        this.listButton = this.controls.querySelector(".list");

        this.gridButton.addEventListener("click", function () {
            that.setToView(GRID_VIEW);
        });
        this.listButton.addEventListener("click", function () {
            that.setToView(LIST_VIEW);
        });

        // Allow rating filtering
        var stars = this.controls.querySelectorAll(".rating-filter");
        this.removeFilter = this.controls.querySelector(".rating-filter-0");

        this.displayFilterStars = function () {
            for (var i = 0; i < 5; i++) {
                if (that.getCurrentRatingFilter() > i) {
                    addClass(stars[i], STAR_FULL_CLASS);
                    removeClass(stars[i], STAR_EMPTY_CLASS);
                } else {
                    addClass(stars[i], STAR_EMPTY_CLASS);
                    removeClass(stars[i], STAR_FULL_CLASS);
                }
            }
        };

        var showRatingPreview = function (rating) {
            for (var i = 0; i < 5; i++) {
                if (rating > i) {
                    addClass(stars[i], STAR_FULL_CLASS);
                    removeClass(stars[i], STAR_EMPTY_CLASS);
                } else {
                    addClass(stars[i], STAR_EMPTY_CLASS);
                    removeClass(stars[i], STAR_FULL_CLASS);
                }
            }
        };

        this.removeFilter.addEventListener("click", function () {
            that.setRatingFilter(0);
        });
        stars[0].addEventListener("click", function () {
            that.setRatingFilter(1);
        });
        stars[1].addEventListener("click", function () {
            that.setRatingFilter(2);
        });
        stars[2].addEventListener("click", function () {
            that.setRatingFilter(3);
        });
        stars[3].addEventListener("click", function () {
            that.setRatingFilter(4);
        });
        stars[4].addEventListener("click", function () {
            that.setRatingFilter(5);
        });

        for (var i = 0; i < 5; i++) {
            stars[i].addEventListener("mouseout", function () {
                that.displayFilterStars();
            });
        }

        stars[0].addEventListener("mouseover", function () {
            showRatingPreview(1);
        });
        stars[1].addEventListener("mouseover", function () {
            showRatingPreview(2);
        });
        stars[2].addEventListener("mouseover", function () {
            showRatingPreview(3);
        });
        stars[3].addEventListener("mouseover", function () {
            showRatingPreview(4);
        });
        stars[4].addEventListener("mouseover", function () {
            showRatingPreview(5);
        });

        // Respond to events to update the view
        this.addListener(function (toolbar, eventType, eventDate) {
            switch (eventType) {
                case LIST_VIEW:
                    addClass(that.listButton, ACTIVE_CLASS);
                    removeClass(that.gridButton, ACTIVE_CLASS);

                    break;
                case GRID_VIEW:
                    addClass(that.gridButton, ACTIVE_CLASS);
                    removeClass(that.listButton, ACTIVE_CLASS);

                    break;
                case RATING_CHANGE:
                    that.displayFilterStars();
                    if (that.getCurrentRatingFilter() == 0) {
                        addClass(that.removeFilter, HIDE_CLASS);
                    } else {
                        removeClass(that.removeFilter, HIDE_CLASS);
                    }

                    break;
                default:
                    console.log("ERROR: Got unexpected event type '" + eventType + "' in ImageCollectionView.handleImageCollectionModelEvent'");
            }
        });
    };

    _.extend(Toolbar.prototype, {
        /**
         * Returns an element representing the toolbar, which can be attached to the DOM.
         */
        getElement: function () {
            return this.container;
        },

        /**
         * Registers the given listener to be notified when the toolbar changes from one
         * view type to another.
         * @param listener_fn A function with signature (toolbar, eventType, eventDate), where
         *                    toolbar is a reference to this object, eventType is a string of
         *                    either, LIST_VIEW, GRID_VIEW, or RATING_CHANGE representing how
         *                    the toolbar has changed (specifically, the user has switched to
         *                    a list view, grid view, or changed the star rating filter).
         *                    eventDate is a Date object representing when the event occurred.
         */
        addListener: function (listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to Toolbar.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the toolbar.
         */
        removeListener: function (listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to Toolbar.removeListener: " + JSON.stringify(arguments));
            }

            this.listeners = _.without(this.listeners, listener_fn);
        },

        /**
         * Sets the toolbar to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW representing the desired view.
         */
        setToView: function (viewType) {
            if (!_.isString(viewType) || (viewType !== LIST_VIEW && viewType != GRID_VIEW)) {
                throw new Error("Invalid arguments supplied to Toolbar.setToView: " + JSON.stringify(arguments));
            }

            if (this.view === viewType) return; // Nothing changed

            this.view = viewType;

            // Notify listeners of a view change
            this.notifyListenersOfEvent(this.view);
        },

        /**
         * Returns the current view selected in the toolbar, a string that is
         * either LIST_VIEW or GRID_VIEW.
         */
        getCurrentView: function () {
            return this.view;
        },

        /**
         * Returns the current rating filter. A number in the range [0,5], where 0 indicates no
         * filtering should take place.
         */
        getCurrentRatingFilter: function () {
            return this.ratingFilter;
        },

        /**
         * Sets the rating filter.
         * @param rating An integer in the range [0,5], where 0 indicates no filtering should take place.
         */
        setRatingFilter: function (rating) {
            if (!(_.isNumber(rating) && rating >= 0 && rating <= 5)) throw new Error("Invalid arguments supplied to Toolbar.setRatingFilter: " + JSON.stringify(arguments));

            if (this.ratingFilter === rating) return; // Nothing changed

            this.ratingFilter = rating;

            // Notify listeners of a rating filter change
            this.notifyListenersOfEvent(RATING_CHANGE);
        },

        /**
         * Notifies listeners of an event
         */
        notifyListenersOfEvent: function (eventType) {
            if (!_.isString(eventType) || (eventType !== LIST_VIEW && eventType !== GRID_VIEW && eventType !== RATING_CHANGE)) {
                throw new Error("Invalid arguments supplied to Toolbar.notifyListenersOfEvent: " + JSON.stringify(arguments));
            }

            var that = this;
            var currentDate = new Date();
            _.each(
                this.listeners,
                function (listener) {
                    listener(that, eventType, currentDate);
                }
            );
        }
    });

    /**
     * An object that will allow the user to choose images to display.
     * @constructor
     */
    var FileChooser = function () {
        this.listeners = [];
        this._init();
    };

    _.extend(FileChooser.prototype, {
        // This code partially derived from: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        _init: function () {
            var self = this;

            var fileChooserTemplate = document.getElementById('file-chooser-template');

            this.fileChooserDiv = document.importNode(fileChooserTemplate.content, true);

            var fileChooserInput = this.fileChooserDiv.querySelector('.photo-files-input');
            fileChooserInput.addEventListener('change', function (evt) {
                var files = evt.target.files;
                var eventDate = new Date();
                _.each(
                    self.listeners,
                    function (listener_fn) {
                        listener_fn(self, files, eventDate);
                    }
                );
            });
        },

        /**
         * Returns an element that can be added to the DOM to display the file chooser.
         */
        getElement: function () {
            return this.fileChooserDiv;
        },

        /**
         * Adds a listener to be notified when a new set of files have been chosen.
         * @param listener_fn A function with signature (fileChooser, fileList, eventDate), where
         *                    fileChooser is a reference to this object, fileList is a list of files
         *                    as returned by the File API, and eventDate is when the files were chosen.
         */
        addListener: function (listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function (listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }

            this.listeners = _.without(this.listeners, listener_fn);
        }
    });

    // Return an object containing all of our classes and constants
    return {
        ImageRenderer: ImageRenderer,
        ImageRendererFactory: ImageRendererFactory,
        ImageCollectionView: ImageCollectionView,
        Toolbar: Toolbar,
        FileChooser: FileChooser,

        LIST_VIEW: LIST_VIEW,
        GRID_VIEW: GRID_VIEW,
        RATING_CHANGE: RATING_CHANGE
    };
}
