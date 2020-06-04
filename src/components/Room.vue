<template>
  <div class="room">
    <v-container>
      <v-row>
        <v-col>
          <video ref="localVideo"></video>
          <v-text-field v-model="roomName" single-line></v-text-field>
          <v-btn @click="join">Join</v-btn>
          <v-btn @click="leave">Leave</v-btn>        
        </v-col>
        <v-col>
          <v-row>
            <v-textarea v-model="textField" outlined readonly></v-textarea>
          </v-row>
          <v-row>
            <v-text-field v-model="message" single-line></v-text-field>
            <v-btn @click="send">Send</v-btn>
          </v-row>
          <v-row>
            <video v-for="(stream, i) in streams" width="240" height="160" playsInline autoplay :key="i" :srcObject.prop="stream"></video>
          </v-row>
          <v-row>
            <v-btn @click="prev">Prev</v-btn>        
            <v-btn @click="next">Next</v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Room',
  props: {
  },
  data: function () {
    return {
      roomName: '',
      textField: '',
      message: '',
      streams: [],
      localStream: null,
      room: null
    }
  },
  methods: {
    joinRoom: function () {
      this.textField += '=== You joined ===\n'
    },
    peerLeave: function (peerId) {
      this.textField += `=== ${peerId} left ===\n`;

      const s = this.streams.findIndex(s => s.peerId === peerId)
      this.streams[s].getTracks().forEach(track => track.stop())
      this.streams.splice(s, 1)
    },
    peerJoin: function (peerId) {
      this.textField += `=== ${peerId} joined ===\n`
    },
    recieveData: function(data, src) {
      this.textField += `${src}: ${data}\n`
    },
    newStream: function (stream) {
      this.textField += `=== new stream ===\n`;
      this.streams.push(stream)
    },
    close: function () {
      this.textField += '== You left ===\n'
      this.streams = []
      
      this.streams.forEach(s => {
        s.getTracks().forEach(track => track.stop());
      })
      this.remoteVideos = []
    },
    join: async function () {
      console.log('join')
      if (!this.peer.open) {
        console.log('Peer is not opened')
        return
      }

      const payload = {mode: 'mesh', stream: this.localStream}
      this.room = this.peer.joinRoom(this.roomName, payload)

      this.room.once('open', this.joinRoom)
      this.room.on('peerJoin', this.peerJoin)
      this.room.on('data', this.recieveData)
      this.room.on('peerLeave', this.peerLeave)
      this.room.once('close', this.close)
      this.room.on('stream', this.newStream)
    },
    leave: function () {
      console.log('leave')
      this.room.close()
    },
    send: function () {
      console.log('send')
      this.textField += this.message + '\n'
      this.room.send(this.message)
      this.message = '';
    },
    initialize: async function () {
      let param = {
        audio: true,
        video: true
      }
      this.localStream = await navigator.mediaDevices.getUserMedia(param).catch(console.error);
      
      let localVideo = this.$refs.localVideo
      localVideo.muted = true
      localVideo.srcObject = this.localStream
      localVideo.playsInline = true

      await localVideo.play().catch(console.error);
    }
  },
  mounted : function() {
    this.initialize().then(() => {})
  },
  destroyed () {
    this.leave()
  }
}
</script>
