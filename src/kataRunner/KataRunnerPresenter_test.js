define(function(require) {

  var KataRunnerPresenter;

  describe('KataRunnerPresenter', function() {

    beforeEach(function(done) {
      KataRunnerPresenter = require('./KataRunnerPresenter');
      done();
    });

    iit('should be defined', function() {
      expect(KataRunnerPresenter).toBeDefined();
      console.log(KataRunnerPresenter);
    });

    it('should have a score model', function() {
      this.fail();
    });

    it('should have a level model', function() {
      this.fail();
    });

    it('should have an actions model', function() {
      this.fail();
    });

    it('should have a milestones model', function() {
      this.fail();
    });

    it('should show questions until score exceeds max score', function() {
      this.fail();
    });

    it('should show milestone view when score exceeds max score', function() {
      this.fail();
    });

    it('should update milestones when score maxes out', function() {
      this.fail();
    });

    it('should show level view when milestones are maxed', function() {
      this.fail();
    });

    it('should update level when milestones are maxed out', function() {
      this.fail();
    });

  });
});
