/*  Rapid Reach training score tracker
    ----------------------------------------------------------
    One file. Every test. Include it on any quiz page with:

      <script src="https://grantenyeart.github.io/training-scores/score.js"></script>

    then when the test is graded, call:

      RRScore.submit({
        quiz:'Product Knowledge', track:'Closers',
        name:name, score:score, total:Q.length,
        passed:pass, missed:'2 5 9'
      }, onSuccess, onFailure);

    THE ENDPOINT LIVES HERE AND NOWHERE ELSE.
    Change the one line below and every quiz on every site picks
    it up on the next page load. No redeploying each quiz.
    ----------------------------------------------------------  */
(function () {
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbwHc46f_yAc3s5rlK3txH5vpak8iJ2RgdeMVxDXpq4iyTXUgMRKpHgxSos0nVorbaxl/exec";

  function submit(d, onOk, onErr) {
    if (!ENDPOINT) {
      console.warn('[RRScore] No endpoint set in score.js. '
        + 'This score was NOT recorded and no email was sent.');
      if (onErr) onErr('no endpoint set');
      return;
    }

    var body = JSON.stringify({
      quiz:   d.quiz  || document.title || 'Untitled test',
      track:  d.track || '',
      name:   (d.name || '').trim(),
      score:  d.score,
      total:  d.total,
      passed: !!d.passed,
      missed: d.missed || '',
      when:   new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
    });

    fetch(ENDPOINT, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: body
    })
    .then(function () { if (onOk) onOk(); })
    .catch(function () { if (onErr) onErr('post failed'); });
  }

  window.RRScore = {
    submit: submit,
    live: function () { return !!ENDPOINT; }
  };
})();
