import { defineComponent } from "vue";
export default defineComponent({
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    return () => {
      return <p>{props.imgUrl}</p>;
    };
  },
});
