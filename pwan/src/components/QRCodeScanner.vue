<template>
  <q-card
      class="card-flex-display"
      
    >
    <q-card-section>
    <video ref="video" width="300" height="300" autoplay></video>
    <canvas ref="canvas" style="display: none;"></canvas> 
    </q-card-section>
    <q-card-section>
       <q-card-actions align="center"> 
        <q-btn
            class="pwan-button top-margin"
            label="  Scan   " 
             @click="startCamera"
            size="md"
            rounded 
            
          />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
import jsQR from "jsqr";

export default {
  data() {
    return {  
      videoStream: null,
    };
  },
  methods: {
    async startCamera() {
      const constraints = [
        { video: { facingMode: { exact: "environment" } } }, // Back camera
        { video: { facingMode: "user" } } // Front camera
      ];
      for (const constraint of constraints) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia( constraint);
            this.videoStream = stream;
            this.$refs.video.srcObject = stream;
            this.$refs.video.play();
            this.scanQRCode();
            break; 
            console.log(stream, "Stream>>>")
          } catch (err) {
              console.warn("Camera not accessible, trying next option...", err);
            }
      }
    },
    scanQRCode() {
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");

      const scan = () => {
        if (this.videoStream) {
          context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);
 

          if (code) {  
            console.log(code, "Code before stop stopCamera")
            this.$emit("scannedDataSubmitted", code.data);
            this.stopCamera();
          }
        }
        requestAnimationFrame(scan);
      };

      requestAnimationFrame(scan);
    },
    stopCamera() {
      if (this.videoStream) {
        console.log("Stop Camera...")
        const tracks = this.videoStream.getTracks();
        tracks.forEach(track => track.stop());
      }
    },
  },
};
</script>

<style scoped>
video {
  border: 1px solid black;
}
</style>
