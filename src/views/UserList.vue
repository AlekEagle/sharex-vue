<template>
    <Header
        title="All Users"
        subtitle="Here are all of the users of the server, do what you will."
        :buttons="[
            {
                title: 'Back to the Admin Dashboard',
                to: '/admin/',
                text: 'Back'
            }
        ]"
    />

    <div class="projects">
        <Project
            v-for="(user, index) in users"
            :key="index"
            :classes="['float', 'auth']"
            :title="user.displayName"
            :to="'/admin/users/' + user.id + '/'"
            >Click me to see more information about
            {{ user.displayName }}</Project
        >
    </div>
    <Footer>
        <div v-if="!loading && !hideLoadMore" class="loadmore">
            <p class="footer_text" @click="loadMore">
                Load More
            </p>
        </div>
        <div v-else-if="!hideLoadMore" class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </Footer>
</template>

<script>
import Header from '@/components/Header.vue';
import Project from '@/components/Project.vue';
import Footer from '@/components/Footer.vue';
export default {
    name: 'UserList',
    components: {
        Header,
        Project,
        Footer
    },
    data() {
        return {
            offset: 0,
            loading: true,
            hideLoadMore: false,
            users: []
        };
    },
    methods: {
        loadMore() {
            this.loading = true;
            fetch('/api/users/?offset=' + this.offset, {
                headers: {
                    Authorization: window.localStorage.getItem('token')
                }
            }).then(users => {
                switch (users.status) {
                    case 200:
                        users.json().then(json => {
                            this.offset += json.users.length;
                            if (json.users.length < 1) {
                                this.hideLoadMore = true;
                            }
                            this.users.push(...json.users);
                            this.loading = false;
                        });
                        break;
                    case 429:
                        this.$parent.$parent.temporaryToast(
                            `Woah, slow down! Please wait ${Math.floor(
                                (users.headers.get('x-ratelimit-reset') * 1000 -
                                    Date.now()) /
                                    1000 /
                                    60
                            )} minutes ${
                                Math.floor(
                                    ((users.headers.get('x-ratelimit-reset') *
                                        1000 -
                                        Date.now()) /
                                        1000) %
                                        60
                                ) !== 0
                                    ? `and ${Math.floor(
                                          ((users.headers.get(
                                              'x-ratelimit-reset'
                                          ) *
                                              1000 -
                                              Date.now()) /
                                              1000) %
                                              60
                                      )} seconds`
                                    : ''
                            } before trying again!`
                        );
                        break;
                    default:
                        this.$parent.$parent.temporaryToast(
                            'An unknown error occurred, if this issue persists contact AlekEagle.'
                        );
                        break;
                }
            });
        }
    },
    beforeMount() {
        fetch('/api/user/', {
            headers: {
                Authorization: `${window.localStorage.getItem('token')}`
            }
        }).then(res => {
            switch (res.status) {
                case 200:
                    res.json().then(json => {
                        if (json.staff === '') {
                            this.$parent.$parent.temporaryToast(
                                "Woah there buddy! You aren't an admin! You aren't supposed to be there!"
                            );
                            this.$router.push('/me/');
                        } else {
                            fetch('/api/users/', {
                                headers: {
                                    Authorization: `${window.localStorage.getItem(
                                        'token'
                                    )}`
                                }
                            }).then(res => {
                                switch (res.status) {
                                    case 200:
                                        res.json().then(json => {
                                            this.users.push(...json.users);
                                            this.offset += json.users.length;
                                            this.loading = false;
                                        });
                                        break;
                                    case 429:
                                        this.$parent.$parent.temporaryToast(
                                            `Woah, slow down! Please wait ${Math.floor(
                                                (res.headers.get(
                                                    'x-ratelimit-reset'
                                                ) *
                                                    1000 -
                                                    Date.now()) /
                                                    1000 /
                                                    60
                                            )} minutes ${
                                                Math.floor(
                                                    ((res.headers.get(
                                                        'x-ratelimit-reset'
                                                    ) *
                                                        1000 -
                                                        Date.now()) /
                                                        1000) %
                                                        60
                                                ) !== 0
                                                    ? `and ${Math.floor(
                                                          ((res.headers.get(
                                                              'x-ratelimit-reset'
                                                          ) *
                                                              1000 -
                                                              Date.now()) /
                                                              1000) %
                                                              60
                                                      )} seconds`
                                                    : ''
                                            } before trying again!`
                                        );
                                        break;
                                }
                            });
                        }
                    });
                    break;
                case 429:
                    this.$parent.$parent.temporaryToast(
                        `Woah, slow down! Please wait ${Math.floor(
                            (res.headers.get('x-ratelimit-reset') * 1000 -
                                Date.now()) /
                                1000 /
                                60
                        )} minutes ${
                            Math.floor(
                                ((res.headers.get('x-ratelimit-reset') * 1000 -
                                    Date.now()) /
                                    1000) %
                                    60
                            ) !== 0
                                ? `and ${Math.floor(
                                      ((res.headers.get('x-ratelimit-reset') *
                                          1000 -
                                          Date.now()) /
                                          1000) %
                                          60
                                  )} seconds`
                                : ''
                        } before trying again!`
                    );
                    break;
                default:
                    this.$router.push(
                        `/auth/?redirect=${window.location.pathname}`
                    );
                    break;
            }
        });
    }
};
</script>

<style>
.loadmore {
    padding-bottom: 23px;
}
.loadmore p {
    cursor: pointer;
}
</style>
