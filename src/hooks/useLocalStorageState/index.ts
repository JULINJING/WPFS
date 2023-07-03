import { isFunction } from 'lodash';
import { ref, watch } from 'vue';

function useLocalStorageState(key, options = {}) {
  const storage = window.localStorage;

  const serializer = (value) => {
    if (options.serializer) {
      return options.serializer(value);
    }
    return JSON.stringify(value);
  };

  const deserializer = (value) => {
    if (options.deserializer) {
      return options.deserializer(value);
    }
    return JSON.parse(value);
  };

  function getStoredValue() {
    try {
      const raw = storage.getItem(key);
      if (raw) {
        return deserializer(raw);
      }
    } catch (e) {
      // console.error(e);
    }
    if (isFunction(options.defaultValue)) {
      return options.defaultValue();
    }
    return options.defaultValue;
  }

  const state = ref(getStoredValue());

  watch(
    state,
    () => {
      storage.setItem(key, serializer(state.value));
    },
    {
      deep: true,
    }
  );

  return state;
}

export default useLocalStorageState;
