export class AudioAnalyzer {
  ctx: AudioContext;
  analyzerNode: AnalyserNode;
  sourceNode: MediaElementAudioSourceNode;

  constructor(audioElement: HTMLAudioElement) {
    this.ctx = new AudioContext();
    this.analyzerNode = this.ctx.createAnalyser();
    this.sourceNode = this.ctx.createMediaElementSource(audioElement);

    // this.analyzerNode.minDecibels = -60;
    // this.analyzerNode.minDecibels = -60;
    this.analyzerNode.maxDecibels = -10;
    this.analyzerNode.smoothingTimeConstant = 0.9;
    this.analyzerNode.fftSize = 512;
    this.sourceNode.connect(this.analyzerNode);
    this.sourceNode.connect(this.ctx.destination);
  }

  getFft() {
    const fftLength = this.analyzerNode.frequencyBinCount;
    const freqData = new Uint8Array(this.analyzerNode.frequencyBinCount);
    this.analyzerNode.getByteFrequencyData(freqData);
    return { freqData, fftLength };
  }
  // getBufferLength() {
  //   const bufferLength = this.analyzerNode.frequencyBinCount
  //   const dataArray  = ne
  // }
}
