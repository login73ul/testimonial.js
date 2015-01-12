'use strict';

describe('Testimonial', function() {
  it('should indexing return 2', function() {
    Testimonial.prototype.$slideList = [1, 2 , 3];
    Testimonial.prototype.currentSlideIndex = 1;

    Testimonial.prototype.indexing();

    var res = Testimonial.prototype.currentSlideIndex;
    expect(res).toEqual(2);
  });

  it('should indexing return 0', function() {
    Testimonial.prototype.$slideList = [];

    Testimonial.prototype.indexing();

    var res = Testimonial.prototype.currentSlideIndex;
    expect(res).toEqual(0);
  });

  it('should indexing zeroed currentSlideIndex', function() {
    Testimonial.prototype.$slideList = [1, 2 , 3];
    Testimonial.prototype.currentSlideIndex = 2;

    Testimonial.prototype.indexing();

    var res = Testimonial.prototype.currentSlideIndex;
    expect(res).toEqual(0);
  });

  it('should getDefaultOptions', function() {
    var options = Testimonial.prototype.getDefaultOptions();

    expect(options.timeout).toEqual(7000);
    expect(options.autostart).toBeTruthy();
    expect(options.slideCount).toEqual(3);
  });

  it('should resizePluginContainer', function() {
    var indents = 20;
    var height = 100;
    var expected = height + indents;
    var obj = $('<div />', {
      height: height
    });
    Testimonial.prototype.$container = $('<div />');
    Testimonial.prototype.$slideList = [obj, $('<div />')];
    Testimonial.prototype.currentSlideIndex = 0;

    Testimonial.prototype.resizePluginContainer();

    expect(Testimonial.prototype.$container.height()).toEqual(expected);
  });

  it('should resizePluginContainer with empty slide list', function() {
    var expected = 0;
    var height = 100;
    var obj = $('<div />', {
      height: height
    });
    Testimonial.prototype.$container = $('<div />');
    Testimonial.prototype.$slideList = [];
    Testimonial.prototype.currentSlideIndex = 0;

    Testimonial.prototype.resizePluginContainer();

    expect(Testimonial.prototype.$container.height()).toEqual(expected);
  });

  it('should createButtonNext', function() {
    spyOn(Testimonial.prototype, 'next');
    Testimonial.prototype.$container = $('<div />');

    Testimonial.prototype.createButtonNext();
    var $obj = Testimonial.prototype.$container.find('div').first();

    $obj.click();
    expect($obj.prop('tagName')).toEqual('DIV');
    expect($obj.attr('class')).toEqual('next_slide');
    expect(Testimonial.prototype.next).toHaveBeenCalled();
  });

  it('should createInfrastructure', function() {
    spyOn(Testimonial.prototype, 'createButtonNext');
    Testimonial.prototype.$container = $('<div />');

    Testimonial.prototype.createInfrastructure();
    var $obj = Testimonial.prototype.$container.find('div').first();

    expect($obj.prop('tagName')).toEqual('DIV');
    expect($obj.attr('class')).toEqual('main_container');
    expect(Testimonial.prototype.createButtonNext).toHaveBeenCalled();
  });

  it('should createSlides', function() {
    Testimonial.prototype.$slideList.length = 0;
    var arr = [{}, {}, {}];
    Testimonial.prototype.dataList = arr;

    Testimonial.prototype.createSlides();

    expect(Testimonial.prototype.$slideList.length).toEqual(arr.length);
  });

  it('should parseDomTree', function() {
    Testimonial.prototype.dataList = [];
    var arr = [1, 2, 3];
    spyOn(Parser.prototype, 'parse').and.returnValue(arr);
    var fileName = 'main.html';
    jasmine.getFixtures().fixturesPath = 'base/test/fixtures';
    loadFixtures(fileName);

    var $container = $('.testimonial_slider');
    Testimonial.prototype.$container = $container;
    Testimonial.prototype.parseDomTree();

    expect(Testimonial.prototype.$container.children().length).toEqual(0);
    expect(Testimonial.prototype.dataList).toEqual(arr);
    expect(Parser.prototype.parse).toHaveBeenCalled();
  });

  it('should parse empty div', function() {
    Testimonial.prototype.dataList = [];

    var $container = $('<div />');
    Testimonial.prototype.$container = $container;
    Testimonial.prototype.parseDomTree();

    expect(Testimonial.prototype.$container.children().length).toEqual(0);
    expect(Testimonial.prototype.dataList.length).toEqual(0);
  });

  it('should initPlugin with autostart', function() {
    spyOn(Testimonial.prototype, 'createOptions');
    spyOn(Testimonial.prototype, 'initSlideList');

    spyOn(Testimonial.prototype, 'start');
    Testimonial.prototype.pluginOptions = {
      autostart: true
    };
    var options = {
      test: 'test'
    };

    Testimonial.prototype.initPlugin(options);

    expect(Testimonial.prototype.createOptions).toHaveBeenCalledWith(options);
    expect(Testimonial.prototype.initSlideList).toHaveBeenCalled();
    expect(Testimonial.prototype.start).toHaveBeenCalled();
    expect(Testimonial.prototype.$slideList.length).toEqual(0);
    expect(Testimonial.prototype.dataList.length).toEqual(0);
    expect(Testimonial.prototype.currentSlideIndex).toEqual(0);
    expect(Testimonial.prototype.slideLoader).toBeUndefined();
  });

  it('should initPlugin without autostart', function() {
    spyOn(Testimonial.prototype, 'createOptions');
    spyOn(Testimonial.prototype, 'initSlideList');

    Testimonial.prototype.pluginOptions = {
      autostart: false
    };
    var options = {
      test: 'test'
    };

    Testimonial.prototype.initPlugin(options);

    expect(Testimonial.prototype.createOptions).toHaveBeenCalledWith(options);
    expect(Testimonial.prototype.initSlideList).toHaveBeenCalled();
    expect(Testimonial.prototype.$slideList.length).toEqual(0);
    expect(Testimonial.prototype.dataList.length).toEqual(0);
    expect(Testimonial.prototype.currentSlideIndex).toEqual(0);
  });

  it('should initSlideList', function() {
    spyOn(Testimonial.prototype, 'parseDomTree');
    spyOn(Testimonial.prototype, 'createSlides');
    spyOn(Testimonial.prototype, 'createInfrastructure');
    spyOn(Testimonial.prototype, 'slideListRendering');
    spyOn(Testimonial.prototype, 'resizePluginContainer');

    Testimonial.prototype.initSlideList();

    expect(Testimonial.prototype.parseDomTree).toHaveBeenCalled();
    expect(Testimonial.prototype.createSlides).toHaveBeenCalled();
    expect(Testimonial.prototype.createInfrastructure).toHaveBeenCalled();
    expect(Testimonial.prototype.slideListRendering).toHaveBeenCalled();
    expect(Testimonial.prototype.resizePluginContainer).toHaveBeenCalled();
  });

  it('should start', function(done) {
    spyOn(Testimonial.prototype, 'next');
    var timeout = 100;
    Testimonial.prototype.pluginOptions = {
      timeout: timeout
    };
    var options = {
      test: 'test'
    };

    Testimonial.prototype.start();

    var delay = timeout + 10;
    setTimeout(function() {
      expect(Testimonial.prototype.next).toHaveBeenCalled();
      expect(Testimonial.prototype.timerId).toBeDefined();
      done();
    }, delay);
  });

  it('should stop', function() {
    Testimonial.prototype.timerId = 10;

    Testimonial.prototype.stop();

    expect(Testimonial.prototype.timerId).toBeUndefined();
  });

  it('should create new Testimonial', function() {
    spyOn(Testimonial.prototype, 'initPlugin');
    var $container = $('<div />');
    var options = {
      test: 'test'
    };

    var testimonial = new Testimonial($container, options);

    expect(testimonial.$container).toEqual($container);
    expect(testimonial.initPlugin).toHaveBeenCalledWith(options);
  });

  it('should rendering slide list', function() {
    var slide1 = new TestimonialSlide();
    var slide2 = new TestimonialSlide();
    Testimonial.prototype.$slideList = [
      slide1,
      slide2,
    ];
    spyOn(Testimonial.prototype, 'slideRendering');
    Testimonial.prototype.currentSlideIndex = 0;

    Testimonial.prototype.slideListRendering();

    expect(Testimonial.prototype.slideRendering).toHaveBeenCalled();
    expect(Testimonial.prototype.slideRendering.calls.count()).toEqual(2);
    expect(Testimonial.prototype.slideRendering.calls.argsFor(0)).toEqual([slide1, true]);
    expect(Testimonial.prototype.slideRendering.calls.argsFor(1)).toEqual([slide2, false]);
  });

  it('should createOptions', function() {
    spyOn(Testimonial.prototype, 'getDefaultOptions').and.callThrough();
    var timeout = 5;
    var options = {
      timeout: timeout
    };

    Testimonial.prototype.createOptions(options);

    expect(Testimonial.prototype.pluginOptions.timeout).toEqual(timeout);
    expect(Testimonial.prototype.getDefaultOptions).toHaveBeenCalled();
  });

  it('should next', function() {
    Testimonial.prototype.timerId = 100;
    Testimonial.prototype.currentSlideIndex = 0;
    var slide1 = new TestimonialSlide();
    var slide2 = new TestimonialSlide();
    Testimonial.prototype.$slideList = [
      slide1,
      slide2
    ];
    spyOn(slide1, 'animateHide');
    spyOn(slide2, 'animateShow');

    spyOn(Testimonial.prototype, 'stop');
    spyOn(Testimonial.prototype, 'indexing').and.callThrough();
    spyOn(Testimonial.prototype, 'resizePluginContainer');
    spyOn(Testimonial.prototype, 'start');

    Testimonial.prototype.next();

    expect(Testimonial.prototype.stop).toHaveBeenCalled();
    expect(Testimonial.prototype.indexing).toHaveBeenCalled();
    expect(Testimonial.prototype.resizePluginContainer).toHaveBeenCalled();
    expect(Testimonial.prototype.start).toHaveBeenCalled();
    expect(slide1.animateHide).toHaveBeenCalled();
    expect(slide2.animateShow).toHaveBeenCalled();
  });

  it('should next without stop', function() {
    Testimonial.prototype.timerId = undefined;
    Testimonial.prototype.currentSlideIndex = 0;
    var slide1 = new TestimonialSlide();
    var slide2 = new TestimonialSlide();
    Testimonial.prototype.$slideList = [
      slide1,
      slide2
    ];
    spyOn(slide1, 'animateHide');
    spyOn(slide2, 'animateShow');

    spyOn(Testimonial.prototype, 'indexing').and.callThrough();
    spyOn(Testimonial.prototype, 'resizePluginContainer');
    spyOn(Testimonial.prototype, 'start');

    Testimonial.prototype.next();

    expect(Testimonial.prototype.indexing).toHaveBeenCalled();
    expect(Testimonial.prototype.resizePluginContainer).toHaveBeenCalled();
    expect(Testimonial.prototype.start).toHaveBeenCalled();
    expect(slide1.animateHide).toHaveBeenCalled();
    expect(slide2.animateShow).toHaveBeenCalled();
  });

  it('should add slide', function() {
    Testimonial.prototype.$slideList = [];
    var slide = {};

    var cSpy = spyOn(window, 'TestimonialSlide');
    spyOn(Testimonial.prototype, 'slideRendering');

    Testimonial.prototype.add(slide);

    expect(cSpy).toHaveBeenCalledWith(slide);
    expect(Testimonial.prototype.$slideList.length).toEqual(1);
    expect(Testimonial.prototype.slideRendering.calls.argsFor(0)[1]).toEqual(false);
  });

  it('should rendering slide', function() {
    var $slideListWrapper = $('<div />');
    Testimonial.prototype.$slideListWrapper = $slideListWrapper;

    var slide = new TestimonialSlide();
    var $node = $('<div />');
    spyOn(slide, 'getDomNode').and.returnValue($node);

    Testimonial.prototype.slideRendering(slide, false);

    expect(slide.getDomNode).toHaveBeenCalled();
    expect(Testimonial.prototype.$slideListWrapper.children().length).toEqual(1);
  });

  it('should rendering slide with hide slide', function() {
    var $slideListWrapper = $('<div />');
    Testimonial.prototype.$slideListWrapper = $slideListWrapper;

    var slide = new TestimonialSlide();
    var $node = $('<div />');
    spyOn(slide, 'getDomNode').and.returnValue($node);
    spyOn(slide, 'hideSlide');

    Testimonial.prototype.slideRendering(slide, true);

    expect(slide.getDomNode).toHaveBeenCalled();
    expect(Testimonial.prototype.$slideListWrapper.children().length).toEqual(1);
  });

  describe('Remove slide', function() {
    var slide;
    var slideList;
    var slideCount;

    beforeEach(function() {
      Testimonial.prototype.currentSlideIndex = 0;
      Testimonial.prototype.pluginOptions = {
        slideCount: 2
      };

      slide = new TestimonialSlide()
      slideList = [
        $('<div />'),
        slide,
        $('<div />')
      ];
      slideCount = slideList.length;
      Testimonial.prototype.$slideList = slideList;
    });

    it('should not remove slide', function() {
      Testimonial.prototype.pluginOptions.slideCount = 3;

      Testimonial.prototype.removeSlide();

      expect(Testimonial.prototype.$slideList.length).toEqual(slideCount);
    });

    it('should remove second slide', function() {
      spyOn(slide.$domNode, 'remove');

      Testimonial.prototype.removeSlide();

      expect(slide.$domNode.remove).toHaveBeenCalled();
      expect(Testimonial.prototype.$slideList.length).toEqual(slideCount - 1);
    });

    it('should remove first slide', function() {
      Testimonial.prototype.currentSlideIndex = 1;

      slideList = [
        slide,
        $('<div />'),
        $('<div />')
      ];
      Testimonial.prototype.$slideList = slideList;
      spyOn(slide.$domNode, 'remove');

      Testimonial.prototype.removeSlide();

      expect(slide.$domNode.remove).toHaveBeenCalled();
      expect(Testimonial.prototype.$slideList.length).toEqual(slideCount - 1);
      expect(Testimonial.prototype.currentSlideIndex).toEqual(0);
    });
  });
});
