export class AudioBuffers {
  actx: AudioContext;
  paths: string[];

  constructor(paths: string[]) {
    this.actx = new AudioContext();
    this.paths = paths;
  }

  async getFile(filePath: string) {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.actx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  async setupBuffers() {
    console.log("setting up buffers");
    const audioBuffers = [];
    for (const path of this.paths) {
      const buffer = await this.getFile(path);
      audioBuffers.push(buffer);
    }
    console.log("setting up is done");
    return audioBuffers;
  }

  getPath() {
    console.log(this.paths);
  }

  playBuffer(audioBuffer: AudioBuffer, time: number) {
    const bufferSource = this.actx.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(this.actx.destination);
    bufferSource.loop = true;
    bufferSource.start(time);
  }
}
