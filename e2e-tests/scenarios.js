'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /company when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/company");
  });


  describe('company', function() {

    beforeEach(function() {
      browser.get('index.html#!/company');
    });


    it('should render company when user navigates to /company', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('license', function() {

    beforeEach(function() {
      browser.get('index.html#!/license');
    });


    it('should render license when user navigates to /license', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
