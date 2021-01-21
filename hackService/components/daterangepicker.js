

void (async function () {
    HACKER.directive('datepickrange', class extends HACKER.directiveSuper {
        constructor() {
            super()
            this.test = 111;
        }
        beforeDestroy() {////

        }
        destroyed() {

        }
        inserted(node, value) {
            let poper = this.popup(node, 670, 272, -100, 40, {

            }, {
                closeWhenClickOutside: true
            }).attachTo(node),
                { instance } = poper;
            instance.innerHTML = 'helo world'
            // this.popup.apply(this, [Array(6).fill(undefined), false].flat())
            // console.log('yes-', this.test)


            // let fun = () => {
            //     console.log("yes-")
            //     HACKER.$bus.off('B_AFTER_ROUTE_CHANGE', fun)
            //     HACKER.$bus.off('B_RE_PARSE', fun)
            // }

            // HACKER.$bus.on("B_AFTER_ROUTE_CHANGE B_RE_PARSE".split(" "), fun)
            // // HACKER.$bus.on("B_RE_PARSE".split(" "), () => {
            // //     fun()
            // //     HACKER.$bus.off('B_AFTER_ROUTE_CHANGE')
            // //     HACKER.$bus.once("B_AFTER_ROUTE_CHANGE".split(" "), fun)
            // // })

        }
    })
})();