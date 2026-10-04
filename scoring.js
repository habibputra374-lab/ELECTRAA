'use strict';
window.ElectraScoring = Object.freeze({
  mission(correct, confidence) {
    if (typeof correct !== 'boolean' || !Number.isInteger(confidence) || confidence < 1 || confidence > 5) {
      throw new Error('Jawaban dan tingkat keyakinan 1–5 harus valid.');
    }
    const sign = correct ? 1 : -1;
    return Object.freeze({base:10, correct, confidence, answerDelta:sign*5, confidenceDelta:sign*confidence, score:10+sign*(5+confidence)});
  },
  summary(states) {
    return {
      base:states.length*10,
      total:states.reduce((sum,state)=>sum+(state.result ? state.result.score : 10),0),
      completed:states.filter(state=>state.result).length,
      correct:states.filter(state=>state.result?.correct).length,
      maximum:states.length*20
    };
  }
});
