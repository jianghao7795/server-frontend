import Content from "./content";
import { useUserStore } from "@/stores/user";
import Header from "./header";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    return () => (
      <div class="view-content">
        {userStore.currentUser?.user?.ID && (
          <div>
            <h4>介绍: {userStore.currentUser?.user?.nickName}</h4>
            <div class="about-content">
              <Content imgUrl={userStore.currentUser?.user?.introduction} />
            </div>
          </div>
        )}
        {!userStore.currentUser?.user?.ID && <div>请登录！</div>}
        <Header />
      </div>
    );
  },
});
