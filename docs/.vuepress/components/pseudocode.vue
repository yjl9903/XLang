<template>
  <pre ref="pre" style="display:hidden;"><slot></slot></pre>
</template>

<script>
import pseudocode from 'pseudocode';

export default {
  name: 'Pseudocode',
  props: {
    lineNumber: Boolean,
    lineNumberPunc: String
  },
  mounted() {
    this.$nextTick(() => {
      pseudocode.renderElement(this.$refs.pre, {
        lineNumber: this.lineNumber,
        lineNumberPunc: this.lineNumberPunc
      });
    });
  }
}
</script>
