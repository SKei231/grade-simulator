<template>
    <draggable>
        <li v-for="(ps, pasIndex) in props" style="border-radius: 5px; margin: 2px; padding: 2px;">
            <select v-model="props.modelValue[pasIndex].index" @change="displayUpdate()">
                <option v-for="(passive, aIndex) in passiveSkills" v-bind:class="passive.Color" v-bind:value="aIndex">【{{ passive.Name }}】{{ passive.Attribute }} {{ passive.Value }}%up</option>
            </select>
            <div style="display: flex;">
                <div class="btn" style="font-size: 12px; padding: 1px 10px; margin-right: 20px;" @click="unsetPassive(index, pasIndex)">削除</div>
                <div class="dragHandle" style="width: 50px; height: 20px; position: relative;">
                    <span style="display: block; position: absolute; top: 50%; left: 50%; margin: -4px 0 0 -10px; width: 20px; height: 4px; border-top: 2px rgba(0, 0, 0, .4) solid; border-bottom: 2px rgba(0, 0, 0, .4) solid; "></span>
                </div>
            </div>
        </li>
    </draggable>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';

const props = defineProps<{modelValue: [{
    index: number,
    times: number
}]}>()
const emits = defineEmits<{(e: 'update:modelValue', text: string): void}>()

const onInputText = (e: Event) => {
  const target = e.target as HTMLInputElement
  emits('update:modelValue', target.value)
}

</script>

<style scoped>

/* モバイル　1000px
--------------------------------------------------------------------------------- */
@media screen and (max-width: 1030px) {
}
</style>