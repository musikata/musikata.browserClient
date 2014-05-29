define(function(require) {

  var Backbone;
  var _;
  var KataRunnerPresenter;
  var mockRunnerView;

  describe('KataRunnerPresenter', function() {

    beforeEach(function(done) {
      // Load dependencies.
      Backbone = require('backbone'); 
      _ = require('underscore');
      KataRunnerPresenter = require('./KataRunnerPresenter');

      // Setup mock runner view.
      mockRunnerView = jasmine.createSpyObj(
        'mockRunnerView', ['setBodyView']);
      _.extend(mockRunnerView, Backbone.Events);

      done();
    });

    it('should be defined', function() {
      expect(KataRunnerPresenter).toBeDefined();
    });

    describe('when starting', function(){
      it('should show kata', function() {
        presenter = new KataRunnerPresenter();
        presenter.setView(mockRunnerView);
        spyOn(presenter, '_showKata');
        presenter.start();
        expect(presenter._showKata).toHaveBeenCalled();
      });
    });

    describe('after starting', function() {
      var presenter;

      beforeEach(function() {
        presenter = new KataRunnerPresenter();
        presenter.setView(mockRunnerView);
        presenter.start();
      });

      it('should increment score if passed kata', function() {
        presenter.get('curKataView').trigger('evaluated', {result: 'pass'});
        expect(presenter.get('score')).toBe(10);
      });

      it('should not increment score if failed kata', function() {
        presenter.get('curKataView').trigger('evaluated', {result: 'fail'});
        expect(presenter.get('score')).toBe(0);
      });

      it('should close kata when continue action is triggered', function() {
        spyOn(presenter, '_closeKata');
        presenter.view.trigger('action:continue');
        expect(presenter._closeKata).toHaveBeenCalled();
      });

      describe('when closing kata', function(){
        it('should show milestone if score is maxed out', function() {
          spyOn(presenter, '_showMilestone');
          presenter.set('score', 105);
          presenter._closeKata();
          expect(presenter._showMilestone).toHaveBeenCalled();
        });

        it('should show kata if score is not maxed out', function() {
          spyOn(presenter, '_showKata');
          presenter.set('score', 95);
          presenter._closeKata();
          expect(presenter._showKata).toHaveBeenCalled();
        });
      });

      describe('when closing milestone', function(){
        it('should show level if milestones are maxed out', function() {
          spyOn(presenter, '_showLevel');
          presenter._milestones = 1;
          presenter._closeMilestone();
          expect(presenter._showLevel).toHaveBeenCalled();
        });

        it('should show kata if milestones are not maxed out', function() {
          spyOn(presenter, '_showKata');
          presenter._milestones = 3;
          presenter._closeMilestone();
          expect(presenter._showKata).toHaveBeenCalled();
        });
      });

      describe('when closing level', function(){
        it('should show kata ', function() {
          spyOn(presenter, '_showKata');
          presenter._closeLevel();
          expect(presenter._showKata).toHaveBeenCalled();
        });
      });

    });
  });
});
