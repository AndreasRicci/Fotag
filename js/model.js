'use strict';

// Global access - possibly remove if someone else works better and fits application constraints
var IMAGE_META_DATA_CHANGED_EVENT = 'IMAGE_META_DATA_CHANGED_EVENT';
var IMAGE_ADDED_TO_COLLECTION_EVENT = 'IMAGE_ADDED_TO_COLLECTION_EVENT';
var IMAGE_REMOVED_FROM_COLLECTION_EVENT = 'IMAGE_REMOVED_FROM_COLLECTION_EVENT';

/**
 * A function that creates and returns all of the model classes and constants.
 */
function createModelModule() {

    /**
     * An ImageModel represents a reference to an image on the local file system. You should assume
     * that all images are within the ./images directory.
     * @param pathToFile The relative path to the image. A string.
     * @param modificationDate The modification date of the file. A Date.
     * @param caption A user-supplied caption. Users may not provide a caption. A string.
     * @param rating The rating, from 0-5, the user has provided for the image. The rating is an integer.
     *               A rating of 0 indicates that the user has not yet supplied a rating for the image.
     * @constructor
     */
    var ImageModel = function (pathToFile, modificationDate, caption, rating) {
        if (!(
                _.isString(pathToFile)
                && (modificationDate instanceof Date)
                && _.isString(caption)
                && (_.isNumber(rating) && rating >= 0 && rating <= 5)
            )) {
            throw new Error("Invalid arguments supplied to ImageModel: " + JSON.stringify(arguments));
        }

        this.path = pathToFile;
        this.modificationDate = modificationDate;
        this.caption = caption;
        this.rating = rating;

        // Event listeners
        this.listeners = [];
    };

    _.extend(ImageModel.prototype, {

        /**
         * Adds a listener to be notified of when the model changes.
         * @param listener_fn A function with the signature: (imageModel, eventDate),
         * where imageModel is a reference to this object, and eventDate is a Date
         * object indicating the time of the event.
         */
        addListener: function (listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to ImageModel.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function (listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to ImageModel.removeListener: " + JSON.stringify(arguments));
            }

            this.listeners = _.without(this.listeners, listener_fn);
        },

        /**
         * Returns a string representing the caption. Must return an empty string if the
         * user has not supplied a caption for the image.
         */
        getCaption: function () {
            return this.caption;
        },

        /**
         * Sets the caption for this image.
         * @param caption A string representing a user caption.
         */
        setCaption: function (caption) {
            if (!_.isString(caption)) throw new Error("Invalid arguments supplied to ImageModel.setCaption: " + JSON.stringify(arguments));

            if (this.caption === caption) return; // Nothing changed

            this.caption = caption;

            this.notifyListenersOfMetadataChange();
        },

        /**
         * Returns the user-supplied rating of the image. A user can provide a rating between 1-5.
         * If no rating has been given, should return 0.
         */
        getRating: function () {
            return this.rating;
        },

        /**
         * Sets the user-supplied rating of the image.
         * @param rating An integer in the range [0,5] (where a 0 indicates the user is clearing their rating)
         */
        setRating: function (rating) {
            if (!(_.isNumber(rating) && rating >= 0 && rating <= 5)) throw new Error("Invalid arguments supplied to ImageModel.setRating: " + JSON.stringify(arguments));

            if (this.rating === rating) return; // Nothing changed

            this.rating = rating;

            this.notifyListenersOfMetadataChange();
        },

        /**
         * Returns a complete path to the image suitable for inserting into an img tag.
         */
        getPath: function () {
            return this.path;
        },

        /**
         * Returns the modification date (a Date object) for this image.
         */
        getModificationDate: function () {
            return this.modificationDate;
        },

        /**
         * Notifies listeners of a change in metadata
         */
        notifyListenersOfMetadataChange: function () {
            var that = this;
            var currentDate = new Date();
            _.each(
                this.listeners,
                function (listener) {
                    listener(that, currentDate);
                }
            );
        }
    });

    /**
     * Manages a collection of ImageModel objects.
     */
    var ImageCollectionModel = function () {
        var that = this;

        this.imageModels = [];

        // Event listeners
        this.listeners = [];

        /**
         * Notifies listeners of an IMAGE_META_DATA_CHANGED_EVENT
         */
        this.notifyListenersOfImageMetadataChange = function (imageModel, eventDate) {
            if (!(imageModel instanceof ImageModel) || !(eventDate instanceof Date)) {
                throw new Error("Invalid arguments to ImageCollectionModel.notifyListenersOfImageMetadataChange: " + JSON.stringify(arguments));
            }

            that.notifyListenersOfEvent(IMAGE_META_DATA_CHANGED_EVENT, imageModel);
        };
    };

    _.extend(ImageCollectionModel.prototype, {

        /**
         * Adds a listener to the collection to be notified of when the collection or an image
         * in the collection changes.
         * @param listener_fn A function with the signature (eventType, imageModelCollection, imageModel, eventDate),
         *                    where eventType is a string of either
         *                    - IMAGE_ADDED_TO_COLLECTION_EVENT,
         *                    - IMAGE_REMOVED_FROM_COLLECTION_EVENT, or
         *                    - IMAGE_META_DATA_CHANGED_EVENT.
         *                    imageModelCollection is a reference to this object, imageModel is the imageModel
         *                    that was added, removed, or changed, and eventDate is a Date object representing the
         *                    time when the change occurred.
         */
        addListener: function (listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to ImageCollectionModel.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the object.
         * @param listener_fn
         */
        removeListener: function (listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to ImageCollectionModel.removeListener: " + JSON.stringify(arguments));
            }

            this.listeners = _.without(this.listeners, listener_fn);
        },

        /**
         * Adds an ImageModel object to the collection. When adding an ImageModel, this object should
         * register as a listener for that object, and notify its own (i.e., the ImageCollectionModel's listeners)
         * when that ImageModel changes.
         * @param imageModel
         */
        addImageModel: function (imageModel) {
            if (!(imageModel instanceof ImageModel)) {
                throw new Error("Invalid arguments to ImageCollectionModel.addImageModel: " + JSON.stringify(arguments));
            }

            this.imageModels.push(imageModel);

            // Add event listener to be notified of any changes to this image model
            imageModel.addListener(this.notifyListenersOfImageMetadataChange);

            // Notify listeners that the image model was added
            this.notifyListenersOfEvent(IMAGE_ADDED_TO_COLLECTION_EVENT, imageModel);
        },

        /**
         * Removes the given ImageModel object from the collection and removes any listeners it has
         * registered with the ImageModel.
         * @param imageModel
         */
        removeImageModel: function (imageModel) {
            if (!(imageModel instanceof ImageModel)) {
                throw new Error("Invalid arguments to ImageCollectionModel.removeImageModel: " + JSON.stringify(arguments));
            }

            if (!_.contains(this.imageModels, imageModel)) return; // imageModel does not exist in our collection

            // Remove it
            this.imageModels = _.without(this.imageModels, imageModel);

            // Remove any event listeners
            imageModel.removeListener(this.notifyListenersOfImageMetadataChange);

            // Notify listeners that the image model was removed
            this.notifyListenersOfEvent(IMAGE_REMOVED_FROM_COLLECTION_EVENT, imageModel);
        },

        /**
         * Returns an array of all ImageModel objects currently in this collection.
         */
        getImageModels: function () {
            return this.imageModels.slice();
        },

        /**
         * Notifies listeners of an event
         */
        notifyListenersOfEvent: function (eventType, imageModel) {
            if (!_.isString(eventType) || !(imageModel instanceof ImageModel) || (eventType !== IMAGE_META_DATA_CHANGED_EVENT && eventType !== IMAGE_ADDED_TO_COLLECTION_EVENT && eventType != IMAGE_REMOVED_FROM_COLLECTION_EVENT)) {
                throw new Error("Invalid arguments supplied to ImageCollectionModel.notifyListenersOfEvent: " + JSON.stringify(arguments));
            }

            var that = this;
            var currentDate = new Date();
            _.each(
                this.listeners,
                function (listener) {
                    listener(eventType, that, imageModel, currentDate);
                }
            );
        }
    });

    /**
     * Given an ImageCollectionModel, stores all of its contents in localStorage.
     */
    function storeImageCollectionModel(imageCollectionModel) {
        var models = _.map(
            imageCollectionModel.getImageModels(),
            function (imageModel) {
                return {
                    path: imageModel.getPath(),
                    modificationDate: imageModel.getModificationDate(),
                    caption: imageModel.getCaption(),
                    rating: imageModel.getRating()
                };
            }
        );
        localStorage.setItem('imageCollectionModel', JSON.stringify(models));
    }

    /**
     * Returns a new ImageCollectionModel object with contents loaded from localStorage.
     */
    function loadImageCollectionModel() {
        var imageCollectionModel = new ImageCollectionModel();
        var modelsJSON = localStorage.getItem('imageCollectionModel');
        if (modelsJSON) {
            var models = JSON.parse(modelsJSON);
            _.each(
                models,
                function (model) {
                    try {
                        var imageModel = new ImageModel(
                            model.path,
                            new Date(model.modificationDate),
                            model.caption,
                            model.rating
                        );
                        imageCollectionModel.addImageModel(imageModel);
                    } catch (err) {
                        console.log("Error creating ImageModel: " + err);
                    }
                }
            );
        }
        return imageCollectionModel;
    }

    // Return an object containing all of our classes and constants
    return {
        ImageModel: ImageModel,
        ImageCollectionModel: ImageCollectionModel,

        IMAGE_ADDED_TO_COLLECTION_EVENT: IMAGE_ADDED_TO_COLLECTION_EVENT,
        IMAGE_REMOVED_FROM_COLLECTION_EVENT: IMAGE_REMOVED_FROM_COLLECTION_EVENT,
        IMAGE_META_DATA_CHANGED_EVENT: IMAGE_META_DATA_CHANGED_EVENT,

        storeImageCollectionModel: storeImageCollectionModel,
        loadImageCollectionModel: loadImageCollectionModel
    };
}
