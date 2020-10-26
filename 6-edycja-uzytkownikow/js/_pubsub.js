export const pubsub = {
    subscribers: {},

    subscribe(subject, fn) {
        if (this.subscribers[subject] === undefined) {
            this.subscribers[subject] = [];
        }
        this.subscribers[subject].push(fn);
    },

    unsubscribe(subject, fn) {
        if (this.subscribers[subject]) {
            const index = this.subscribers.findIndex(el => el === fn);
            this.subscribers[subject].splice(index, 1);
        }
    },

    emit(subject, data) {
        if (this.subscribers[subject]) {
            this.subscribers[subject].forEach(fn => fn(data));
        }
    }
}