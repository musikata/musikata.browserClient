define(function(require) {

  var Backbone;
  var KataRunnerPresenter;

  describe('KataRunnerPresenter', function() {

    beforeEach(function(done) {
      Backbone = require('backbone'); 
      KataRunnerPresenter = require('./KataRunnerPresenter');
      done();
    });

    it('should be defined', function() {
      expect(KataRunnerPresenter).toBeDefined();
    });

    describe('after starting', function() {

      it('should show kata', function() {
        var presenter = new KataRunnerPresenter();
        spyOn(presenter, '_showKata');

        presenter.start();

        expect(presenter._showKata).toHaveBeenCalled();
      });

      it('should update actions per kata action events', function () {
        var presenter = new KataRunnerPresenter();
        spyOn(presenter, '_setActions');

        presenter.start();
        presenter.get('curKata').trigger('actions:set');
        expect(presenter._setActions).toHaveBeenCalled();
      });

      it('should increment score if passed kata', function() {
        var presenter = new KataRunnerPresenter();

        presenter.start();
        presenter.get('curKata').set('result', 'pass');

        expect(presenter.get('score')).toBe(10);
      });

      it('should not increment score if failed kata', function() {
        var presenter = new KataRunnerPresenter();

        presenter.start();
        presenter.get('curKata').set('result', 'fail');

        expect(presenter.get('score')).toBe(0);
      });

      it('should show milestone when score maxes out', function() {
        var presenter = new KataRunnerPresenter();
        spyOn(presenter, '_showMilestone');

        presenter.start();
        presenter.set('score', 95);
        presenter.get('curKata').set('result', 'pass');

        expect(presenter._showMilestone).toHaveBeenCalled();
      });

      it('should show level when milestones max out', function() {
        var presenter = new KataRunnerPresenter();
        spyOn(presenter, '_showLevel');

        presenter.start();
        presenter._remainingMilestones = 1;
        presenter._showMilestone();
        presenter._closeMilestone();

        expect(presenter._showLevel).toHaveBeenCalled();
      });

    });
  });
});
