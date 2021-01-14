<template>
  <transition name="modal">
    <div class="modal-mask" v-if="sharedState.show" @click="__hideModal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <p
            class="modal-close-button"
            v-show="sharedState.cancelable"
            @click="__hideModal"
          >
            X
          </p>
          <h2 class="modal-title" v-text="sharedState.title" />
          <div class="modal-content">
            <slot />
          </div>
          <div class="modal-buttons">
            <template
              v-for="(button, index) in sharedState.buttons"
              :key="index"
            >
              <button
                :title="button.title"
                class="button modal-button"
                @click="__handleButtonClick(index)"
              >
                {{ button.text }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Modal',
    props: {
      title: String,
      show: Boolean,
      buttons: Array,
      cancelable: Boolean
    },
    mounted() {
      this.sharedState.title = this.title;
      this.sharedState.show = this.show;
      this.sharedState.buttons = this.buttons;
      this.sharedState.cancelable = this.cancelable;

      if (this.sharedState.show === true) {
        document.addEventListener('keydown', this.__hideModal);
      }
    },
    methods: {
      __hideModal(e) {
        if (
          (this.sharedState.cancelable &&
            !!e.path
              .slice(0, 2)
              .map(
                ele =>
                  ele.classList.contains('modal-mask') ||
                  ele.classList.contains('modal-close-button')
              )
              .filter(val => val === true)[0]) ||
          (e.type === 'keydown' &&
            e.key === 'Escape' &&
            this.sharedState.cancelable)
        ) {
          if (e.type === 'keydown' && e.key === 'Escape') {
            document.removeEventListener('keydown', this.__hideModal);
          }
          this.sharedState.show = false;
        }
      },
      __handleButtonClick(index) {
        this.sharedState.buttons[index].action(this);
      },
      showModal() {
        this.sharedState.show = true;
        document.addEventListener('keydown', this.__hideModal);
      },
      set(values) {
        this.sharedState = { ...this.sharedState, ...values };
      },
      hideModal() {
        this.sharedState.show = false;
      }
    },
    data() {
      return {
        privateState: {},
        sharedState: {
          title: '',
          show: false,
          buttons: [],
          cancelable: false
        }
      };
    }
  };
</script>

<style>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000040;
    display: table;
  }

  .modal-close-button {
    position: absolute;
    top: 15px;
    right: 22px;
    font-size: 30px;
    margin-top: 0px;
    z-index: 9999;
    cursor: pointer;
    padding: 10px;
    transition-duration: 0.4s;
  }

  .modal-close-button:hover,
  .modal-close-button:focus,
  .modal-close-button:active {
    color: #2196f3;
    text-shadow: 0px 0px 5px #2196f3;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-title {
    margin-top: 0;
  }

  .modal-container {
    position: relative;
    width: fit-content;
    margin: 0 auto;
    padding: 20px 50px;
    background-color: #333333;
    border-radius: 10px;
    box-shadow: 13px 13px 5px #141414, inset 0px 0px 5px #2c2c2c;
    max-width: 80%;
  }

  .modal-enter-active {
    animation: fadein-modal 0.5s;
  }

  .modal-leave-active {
    animation: fadeout-modal 0.5s;
  }

  @keyframes fadein-modal {
    from {
      bottom: -45px;
      opacity: 0;
    }

    to {
      bottom: 30px;
      opacity: 1;
    }
  }

  @keyframes fadeout-modal {
    from {
      bottom: 30px;
      opacity: 1;
    }

    to {
      bottom: -45px;
      opacity: 0;
    }
  }
</style>
