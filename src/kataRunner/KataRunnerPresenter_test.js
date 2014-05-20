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
      console.log(KataRunnerPresenter);
    });

    describe('after starting', function() {

      it('should show challenge if score < max score', function() {
        var presenter = new KataRunnerPresenter();
        spyOn(presenter, '_showChallenge');

        presenter.start();

        expect(presenter._showChallenge).toHaveBeenCalled();
      });

      it('should increment score if passed challenge', function() {
        var presenter = new KataRunnerPresenter();

        presenter.start();
        presenter.get('curChallenge').set('result', 'pass');

        expect(presenter.get('score')).toBe(10);
      });

      it('should not increment score if failed challenge', function() {
        var presenter = new KataRunnerPresenter();

        presenter.start();
        presenter.get('curChallenge').set('result', 'fail');

        expect(presenter.get('score')).toBe(0);
      });

      iit('should show milestone when score maxes out', function() {
        var presenter = new KataRunnerPresenter();
        spyOn(presenter, '_showMilestone');

        presenter.start();
        presenter.set('score', 95);
        presenter.get('curChallenge').set('result', 'pass');

        expect(presenter._showMilestone).toHaveBeenCalled();
      });

      it('should show level view when milestones are maxed', function() {
        this.fail();
      });

      it('should update level when milestones are maxed out', function() {
        this.fail();
      });

    });
  });
});
