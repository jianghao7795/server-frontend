import Content from "./content.vue";
import { useUserStore } from "@/stores/user";
import Header from "./header";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    return () => (
      <div className="view-content">
        {userStore.currentUser?.user?.ID && (
          <div>
            <h4>介绍: {userStore.currentUser?.user?.nickName}</h4>
            <div className="about-content">
              <Content imgUrl={userStore.currentUser?.user?.introduction} />
            </div>
          </div>
        )}
        {!userStore.currentUser?.user?.ID && <div>请登录！</div>}
        <Header />
        tstsfasdf
      </div>
    );
  },
});
