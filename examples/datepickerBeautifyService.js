// HACKER.mutationObserverRouteWrapper = '.m-wrapper';//--//
//----
//---
function formatDate(str) {
    return HACKER.formatTime(new Date(str), true)
  }
  // let $ = window.jQuery;
  let pendingDatePickerPopInstance;
  
  new HACKER.viewmodel({
    bindRoute: '/form',
    styles() {
      return createGlobalStyle`
      .mat-button-toggle-focus-overlay
          {display:none !important;opacity:0 ${true ? '!important' : '!important'};}
  
          .mat-button-toggle-label-content
            {border-left:solid 1px #ebedf2 ${true ? '!important' : '!important'}}
        .mat-tab-header{
            position: relative;
            left: -20px;
        }
      .mat-raised-button.mat-primary{
          background-color:#384ad7;
      }
  .mat-tab-label-content{
      position:relative;
      top:-12px;
  }
  .mat-raised-button.mat-primary:hover{
      background-color:#0420fb;
  }
      `
    },
  
    reloadTrigger: ['mat-button-toggle-label-content'], //点不用写，只接受classname值
    waitUntil: () => HACKER.$.$('.mat-datepicker-toggle-default-icon'),
    domContext: (pollResult) => pollResult[0].closest('.mat-tab-body-content'),
    state() {
  
      this.$nextTick(()=>{
        this.setState({
          startTime: this.$refs.startTime.value,
          endTime: this.$refs.endTime.value,
        })
      })
      
      // setTimeout(() => {
       
      //     this.setState({
      //         activedSubTab: '终端上线率',
      //         activedTab: '终端报表',
      //     })
      // })
      return {
        list: this.useWaitResult(),
        // foo: 'bar',
  
        // arrayTest: []
      }
    },
    smartState: {
      activedSubTab: () => document.querySelector('.mat-button-toggle-checked').innerText
    },
  
  
  
  
    replacer: [{
      target: '.m-subheader__breadcrumbs',
      // newAlias: 'menuWrapper',
      // oldAlias: 'defaultMenu',
      render() {
        return html`<ul foo1="" class="m-subheader__breadcrumbs m-nav m-nav--inline">
    <li style="position:relative;left:15px;" foo1="" class="m-nav__item m-nav__item--home"><a foo1=""
        class="m-nav__link m-nav__link--icon" foo2="/" href="javascript:;"><i foo1=""
          class="m-nav__link-icon la la-home"></i></a></li>
    <!--bindings={
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              "ng-reflect-ng-for-of": "[object Object],[object Object"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }-->
    <!---->
    <li foo1="" class="m-nav__separator ng-star-inserted">-</li>
    <li foo1="" class="m-nav__item ng-star-inserted"><a foo1="" class="m-nav__link" ng-reflect-query-params-handling=""
        foo2="/logs" href="javascript:;"><span foo1="" class="m-nav__link-text"> 报表管理 </span></a></li>
    <!---->
    <li foo1="" class="m-nav__separator ng-star-inserted">-</li>
    <li data-hacker @click="this.HACKER.$.$('.mat-button-toggle-label-content')[0].click();this.restartHacker();" id="switch-tab" foo1="" class="m-nav__item ng-star-inserted"><a foo1="" class="m-nav__link"
        ng-reflect-query-params-handling="" foo2="/logs/human" href="javascript:;"><span foo1="" class="m-nav__link-text">
          终端报表 </span></a></li>
    <!---->
    <li foo1="" class="m-nav__separator ng-star-inserted">-</li>
    <li foo1="" class="m-nav__item ng-star-inserted"><a data-hacker id="menu-three" foo1="" class="m-nav__link"
        ng-reflect-query-params-handling="merge" foo2="/logs/human/pc" href="javascript:;"><span foo1=""
          class="m-nav__link-text"> ${this.smartState.activedSubTab} </span></a></li>
  </ul>`
      },
      // controller: {
        // methods:{
        //   switchTabClick(e){
        //     // console.log('thisssssssssss---:',this,e)
        //     $('.mat-button-toggle-label-content')[0].click()
        //   }
        // },
        // refListeners: {
        //   switchTab:{
        //     click(){
        //       this.methods.switchTabClick.call(this)
              
        //     }
        //   }
        // }
      // }
  
    }],
    methods: {
  
      renderDateRangePicker() {
  
        let currentRouteVM=this;
  
        // alert('render invoked')//
        let $insertBeforeTarget = HACKER.$.$$('.mat-raised-button.mat-primary')
        // let $insertBeforeTarget = $(HACKER.mutationObserverRouteWrapper).find('.mat-raised-button.mat-primary')
       
  
        currentRouteVM.$doms.dateRangeTrigger=HACKER.generateEl(html`<input value="${formatDate(currentRouteVM.$refs.startTime.value) + ' ~ ' + formatDate(this.$refs.endTime.value)}" 
            style="display:inline;width:237px;position:relative;left:-200px;margin-right:20px;"
             class="form-control ng-pristine ng-valid ng-touched"/>` )
  
  
  HACKER.$bus.routeData.$refs.firstDateRangePicker.replaceWith(currentRouteVM.$doms.dateRangeTrigger)
  
           
            // HACKER.insertBefore(currentRouteVM.$doms.dateRangeTrigger, $insertBeforeTarget)
            
  
        
  
        let dateRangeTrigger = currentRouteVM.$doms.dateRangeTrigger;
        // let dateRangeTrigger = currentRouteVM.$doms.dateRangeTrigger.get(0);
        setTimeout(async () => {
          // alert("shit")
          let poper = currentRouteVM.popup(dateRangeTrigger, 740, 280, -300, 50, {
            background: 'transparent !important'
          }, {
            closeWhenClickOutside: true
          }).attachTo(dateRangeTrigger, () => {
  
            if (poper.isPopupShow) {
              showCalender()
            }
  
  
          });
          poper.instance.style.background = 'transparent'
          // instance.innerHTML = 'helo world';
  
  
          var self = currentRouteVM;
  
          var {
            win,
            hackerViewModel,
            showCalender
          } = await HACKER.loadIframeComp(poper, 'daterangepicker', {
            mounted() {
  
            },
            onSelected(start, end, label) {
  
              self.setState({
                // startTime: HACKER.formatTime(start, true),
                // endTime: HACKER.formatTime(end, true),
                startTime: start.format('YYYY-MM-DD'),
                endTime: end.format('YYYY-MM-DD')
              })
  
              dateRangeTrigger.value = self.state.startTime + ' ~ ' + self.state.endTime
              console.log('currentRouteVM and args--:', currentRouteVM, arguments)
              $insertBeforeTarget.click()
  
            }
          }) //
          console.log('iframeWin--:', win)
  
  
        })
      }
  
    },
  
  
    firstParsed() {
      
      this.$nextTick(() => {
  
  
        this.renderDateRangePicker()
  
  
  
      })
  
  
    },
  
    reqInterceptor: [
      {
        url: ['/api/admin/pc_onlinestat?', '/api/admin/pc_onlineduration'],
        isFetch: 'BOTH',
        params: {
          begindate: (vm, row,isFetch) => {
  
            // console.log('vm and row--:',vm,row,isFetch)
            return formatDate(vm.state.startTime)
          },
          enddate: (vm) => formatDate(vm.state.endTime)
          // exportcsv:(vm,row,hookConfig)=>{}
        }
      }
      
    ]
    
  })
  