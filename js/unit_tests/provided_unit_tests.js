'use strict';

var expect = chai.expect;

describe("Unit Test 1", function () {
    it("ImageModel: Constructor", function () {
        var currentDate = new Date();

        var modelModule = createModelModule();

        var imageModel1 = new modelModule.ImageModel("/images/filename", currentDate, "caption", 3);

        expect(imageModel1.getPath(), "ImageModel path wrong").to.equal("/images/filename");
        expect(imageModel1.getModificationDate(), "ImageModel modification date wrong").to.equal(currentDate);
        expect(imageModel1.getCaption(), "ImageModel caption wrong").to.equal("caption");
        expect(imageModel1.getRating(), "ImageModel rating wrong").to.equal(3);

        expect(imageModel1.listeners.length, "Listener 1 listeners array length wrong").to.equal(0);
    });
});

describe("Unit Test 2", function () {
    it("ImageModel: Getters and setters", function () {
        var currentDate = new Date();

        var modelModule = createModelModule();

        var imageModel1 = new modelModule.ImageModel("/images/filename", currentDate, "caption", 3);

        imageModel1.setCaption("new caption");
        imageModel1.setRating(4);

        expect(imageModel1.getPath(), "ImageModel path wrong").to.equal("/images/filename");
        expect(imageModel1.getModificationDate(), "ImageModel modification date wrong").to.equal(currentDate);
        expect(imageModel1.getCaption(), "ImageModel caption wrong").to.equal("new caption");
        expect(imageModel1.getRating(), "ImageModel rating wrong").to.equal(4);

        imageModel1.setCaption("another new caption");
        imageModel1.setRating(0);

        expect(imageModel1.getPath(), "ImageModel path wrong").to.equal("/images/filename");
        expect(imageModel1.getModificationDate(), "ImageModel modification date wrong").to.equal(currentDate);
        expect(imageModel1.getCaption(), "ImageModel caption wrong").to.equal("another new caption");
        expect(imageModel1.getRating(), "ImageModel rating wrong").to.equal(0);

        imageModel1.setRating(1);

        expect(imageModel1.getPath(), "ImageModel path wrong").to.equal("/images/filename");
        expect(imageModel1.getModificationDate(), "ImageModel modification date wrong").to.equal(currentDate);
        expect(imageModel1.getCaption(), "ImageModel caption wrong").to.equal("another new caption");
        expect(imageModel1.getRating(), "ImageModel rating wrong").to.equal(1);

        imageModel1.setRating(2);

        expect(imageModel1.getPath(), "ImageModel path wrong").to.equal("/images/filename");
        expect(imageModel1.getModificationDate(), "ImageModel modification date wrong").to.equal(currentDate);
        expect(imageModel1.getCaption(), "ImageModel caption wrong").to.equal("another new caption");
        expect(imageModel1.getRating(), "ImageModel rating wrong").to.equal(2);

        imageModel1.setRating(3);

        expect(imageModel1.getPath(), "ImageModel path wrong").to.equal("/images/filename");
        expect(imageModel1.getModificationDate(), "ImageModel modification date wrong").to.equal(currentDate);
        expect(imageModel1.getCaption(), "ImageModel caption wrong").to.equal("another new caption");
        expect(imageModel1.getRating(), "ImageModel rating wrong").to.equal(3);

        imageModel1.setRating(4);

        expect(imageModel1.getPath(), "ImageModel path wrong").to.equal("/images/filename");
        expect(imageModel1.getModificationDate(), "ImageModel modification date wrong").to.equal(currentDate);
        expect(imageModel1.getCaption(), "ImageModel caption wrong").to.equal("another new caption");
        expect(imageModel1.getRating(), "ImageModel rating wrong").to.equal(4);

        imageModel1.setRating(5);

        expect(imageModel1.getPath(), "ImageModel path wrong").to.equal("/images/filename");
        expect(imageModel1.getModificationDate(), "ImageModel modification date wrong").to.equal(currentDate);
        expect(imageModel1.getCaption(), "ImageModel caption wrong").to.equal("another new caption");
        expect(imageModel1.getRating(), "ImageModel rating wrong").to.equal(5);
    });
});

describe("Unit Test 3", function () {
    it("ImageModel: Listeners - Single", function () {
        var currentDate = new Date();

        var modelModule = createModelModule();

        var imageModel1 = new modelModule.ImageModel("/images/filename", currentDate, "caption", 3);

        var listener1 = sinon.spy();

        imageModel1.addListener(listener1);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(0);

        imageModel1.setCaption("new caption");
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(1);

        imageModel1.setRating(4);
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(2);

        imageModel1.setRating(4);
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(2);

        imageModel1.setRating(0);
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(3);

        imageModel1.setCaption("new caption");
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(3);

        imageModel1.setCaption("another new caption");
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(4);

        imageModel1.removeListener(listener1);

        imageModel1.setCaption("newer caption");
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(4);

        imageModel1.setRating(4);
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(4);

        imageModel1.addListener(listener1);

        imageModel1.setRating(4);
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(4);

        imageModel1.setRating(1);
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(5);

        imageModel1.setCaption("newerer caption");
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(6);
    });
});

describe("Unit Test 4", function () {
    it("ImageModel: Listeners - Multiple", function () {
        var currentDate = new Date();

        var modelModule = createModelModule();

        var imageModel1 = new modelModule.ImageModel("/images/filename", currentDate, "caption", 3);
        var imageModel2 = new modelModule.ImageModel("/images/filename2", currentDate, "caption2", 2);

        var listener1 = sinon.spy();
        var listener2 = sinon.spy();

        expect(imageModel1.listeners.length, "Listener 1 listeners array length wrong").to.equal(0);

        imageModel1.addListener(listener1);

        expect(imageModel1.listeners.length, "Listener 1 listeners array length wrong").to.equal(1);

        imageModel1.addListener(listener2);

        expect(imageModel1.listeners.length, "Listener 1 listeners array length wrong").to.equal(2);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(0);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(0);

        imageModel1.setCaption("new caption");
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(1);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(1);

        imageModel1.setRating(4);
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(2);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(2);

        imageModel1.removeListener(listener2);

        imageModel1.setRating(2);
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(3);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(2);

        imageModel1.addListener(listener2);
        imageModel2.addListener(listener2);

        imageModel2.setCaption("new caption");
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(3);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(3);

        imageModel2.setRating(2);
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(3);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(3);

        imageModel2.setRating(1);
        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(3);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(4);

        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(2);

        imageModel1.removeListener(listener2);

        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(1);

        imageModel1.removeListener(listener2);

        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(1);

        imageModel1.removeListener(listener1);

        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(0);

        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(1);
    });
});

describe("Unit Test 5", function () {
    it("ImageCollectionModel: Constructor", function () {
        var modelModule = createModelModule();

        var imageCollectionModel1 = new modelModule.ImageCollectionModel();

        expect(imageCollectionModel1.listeners.length, "ImageCollectionModel 1 image models array length wrong").to.equal(0);
        expect(imageCollectionModel1.listeners.length, "ImageCollectionModel 1 listeners array length wrong").to.equal(0);
    });
});

describe("Unit Test 6", function () {
    it("ImageCollectionModel: Getters and setters - Single and multiple", function () {
        var currentDate = new Date();

        var modelModule = createModelModule();

        var imageCollectionModel1 = new modelModule.ImageCollectionModel();
        var imageCollectionModel2 = new modelModule.ImageCollectionModel();

        expect(imageCollectionModel1.getImageModels().length, "ImageCollectionModel 1 image models array length wrong").to.equal(0);

        var imageModel1 = new modelModule.ImageModel("/images/filename", currentDate, "caption", 3);

        imageCollectionModel1.addImageModel(imageModel1);
        expect(imageCollectionModel1.getImageModels().length, "ImageCollectionModel 1 image models array length wrong").to.equal(1);

        var imageModel2 = new modelModule.ImageModel("/images/filename", currentDate, "caption", 3);

        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(0);

        imageCollectionModel1.addImageModel(imageModel2);
        expect(imageCollectionModel1.getImageModels().length, "ImageCollectionModel 1 image models array length wrong").to.equal(2);

        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(1);

        imageCollectionModel1.removeImageModel(imageModel2);
        expect(imageCollectionModel1.getImageModels().length, "ImageCollectionModel 1 image models array length wrong").to.equal(1);

        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(1);
        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(0);

        expect(imageCollectionModel2.getImageModels().length, "ImageCollectionModel 2 image models array length wrong").to.equal(0);

        imageCollectionModel2.addImageModel(imageModel1);
        imageCollectionModel2.addImageModel(imageModel2);
        expect(imageCollectionModel2.getImageModels().length, "ImageCollectionModel 2 image models array length wrong").to.equal(2);
        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(2);
        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(1);

        imageCollectionModel1.removeImageModel(imageModel1);
        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(1);
        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(1);

        imageCollectionModel2.removeImageModel(imageModel2);
        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(1);
        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(0);

        imageCollectionModel2.removeImageModel(imageModel1);
        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(0);
        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(0);
        expect(imageCollectionModel1.getImageModels().length, "ImageCollectionModel 1 image models array length wrong").to.equal(0);
        expect(imageCollectionModel2.getImageModels().length, "ImageCollectionModel 2 image models array length wrong").to.equal(0);
    });
});

describe("Unit Test 7", function () {
    it("ImageCollectionModel: Listeners - Single and multiple", function () {
        var currentDate = new Date();

        var modelModule = createModelModule();

        var imageCollectionModel1 = new modelModule.ImageCollectionModel();
        var imageCollectionModel2 = new modelModule.ImageCollectionModel();

        var listener1 = sinon.spy();
        var listener2 = sinon.spy();

        expect(imageCollectionModel1.getImageModels().length, "ImageCollectionModel 1 image models array length wrong").to.equal(0);

        var imageModel1 = new modelModule.ImageModel("/images/filename", currentDate, "caption", 3);

        imageCollectionModel1.addImageModel(imageModel1);
        expect(imageCollectionModel1.getImageModels().length, "ImageCollectionModel 1 image models array length wrong").to.equal(1);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(0);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(0);

        var imageModel2 = new modelModule.ImageModel("/images/filename", currentDate, "caption", 3);

        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(0);

        imageCollectionModel1.addListener(listener1);

        imageCollectionModel1.addImageModel(imageModel2);
        expect(imageCollectionModel1.getImageModels().length, "ImageCollectionModel 1 image models array length wrong").to.equal(2);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(1);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(0);

        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(1);

        imageCollectionModel1.removeImageModel(imageModel2);
        expect(imageCollectionModel1.getImageModels().length, "ImageCollectionModel 1 image models array length wrong").to.equal(1);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(2);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(0);

        imageCollectionModel2.addListener(listener1);
        expect(imageCollectionModel2.listeners.length, "ImageCollectionModel 2 listeners array length wrong").to.equal(1);
        imageCollectionModel2.addListener(listener2);
        expect(imageCollectionModel2.listeners.length, "ImageCollectionModel 2 listeners array length wrong").to.equal(2);

        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(1);
        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(0);

        expect(imageCollectionModel2.getImageModels().length, "ImageCollectionModel 2 image models array length wrong").to.equal(0);

        imageCollectionModel2.addImageModel(imageModel1);
        imageCollectionModel2.addImageModel(imageModel2);
        expect(imageCollectionModel2.getImageModels().length, "ImageCollectionModel 2 image models array length wrong").to.equal(2);
        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(2);
        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(1);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(4);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(2);

        imageModel1.setCaption("abc");

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(6);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(3);

        imageCollectionModel1.removeImageModel(imageModel1);
        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(1);
        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(1);

        imageModel1.setCaption("abc");

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(7);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(3);

        imageCollectionModel2.removeImageModel(imageModel2);
        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(1);
        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(0);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(8);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(4);

        imageCollectionModel2.removeImageModel(imageModel1);
        expect(imageModel1.listeners.length, "ImageModel 1 listeners array length wrong").to.equal(0);
        expect(imageModel2.listeners.length, "ImageModel 2 listeners array length wrong").to.equal(0);
        expect(imageCollectionModel1.getImageModels().length, "ImageCollectionModel 1 image models array length wrong").to.equal(0);
        expect(imageCollectionModel2.getImageModels().length, "ImageCollectionModel 2 image models array length wrong").to.equal(0);
        imageCollectionModel1.removeListener(listener1);
        imageCollectionModel1.removeListener(listener2);
        imageCollectionModel2.removeListener(listener1);
        imageCollectionModel2.removeListener(listener2);
        expect(imageCollectionModel1.listeners.length, "ImageCollectionModel 1 listeners array length wrong").to.equal(0);
        expect(imageCollectionModel2.listeners.length, "ImageCollectionModel 2 listeners array length wrong").to.equal(0);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(9);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(5);

        imageCollectionModel1.addListener(listener1);
        imageCollectionModel1.addListener(listener2);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(9);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(5);

        imageCollectionModel1.addImageModel(imageModel1);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(10);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(6);

        imageModel1.setRating(1);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(11);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(7);

        imageModel1.setRating(1);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(11);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(7);

        imageCollectionModel1.removeListener(listener1);

        imageModel1.setRating(5);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(11);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(8);

        imageCollectionModel1.addListener(listener1);

        imageCollectionModel1.removeImageModel(imageModel1);

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(12);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(9);

        imageModel1.setCaption("xyz");

        expect(listener1.callCount, "Listener 1 call count wrong").to.equal(12);
        expect(listener2.callCount, "Listener 2 call count wrong").to.equal(9);
    });
});
