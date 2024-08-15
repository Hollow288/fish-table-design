<script lang='ts'>
import { defineComponent, onBeforeUnmount, onMounted, ref} from 'vue'
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { INITIAL_EVENTS, createEventId } from './private'

export default defineComponent({
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
          listPlugin
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        locale: 'zh-cn',
        initialView: 'dayGridMonth',
        initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        slotMinTime: '08:00',
        slotMaxTime: '18:00',
        height: 'parent',
        slotDuration: '00:30',
        defaultDate: new Date,
        businessHours: {
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '08:00',
          endTime: '18:00',
        },
        allDaySlot: false,
        buttonText: {
          today: '今天',
          month: '月',
          week: '周',
          day: '日',
          list: '日程'
        },
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      } as CalendarOptions,
      currentEvents: [] as EventApi[],
      deptData: [
          {
            deptId: 1,
            deptName: '综合部'
          },
          {
            deptId: 2,
            deptName: '财务部'
          }
      ]
    }
  },
  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },
    handleDateSelect(selectInfo: DateSelectArg) {
      let title = prompt('Please enter a new title for your event')
      let calendarApi = selectInfo.view.calendar
      calendarApi.unselect() // clear date selection

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
      }
    },
    handleEventClick(clickInfo: EventClickArg) {
      debugger
      console.log(clickInfo)
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
    },
    handleEvents(events: EventApi[]) {
      this.currentEvents = events
    },
  }

})

</script>

<template>
  <main class="flex h-[calc(100%-144px)] flex-col">
    <div class='demo-app'>

      <div class='demo-app-main'>
        <FullCalendar
            class='demo-app-calendar'
            :options='calendarOptions'
            :style="{ marginTop:'5px', height: '557px' }"
        >
          <template v-slot:eventContent='arg'>
            <b>{{ arg.timeText }}</b>
            <i>{{ arg.event.title }}</i>
          </template>
        </FullCalendar>
      </div>

    </div>
  </main>

</template>

<style lang='css'>

h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b { /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  //display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc { /* the calendar root */
  //max-width: 1100px;
  margin: 0 auto;
}

</style>