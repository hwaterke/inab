import {selectMonth} from '../../src/reducers/month';
import {
  getSelectedMonthMoment,
  getPreviousMonthMoment,
  getNextMonthMoment
} from '../../src/selectors/month';

export function monthSelectorTests(getStore) {
  describe('Month selectors', () => {
    test('getSelectedMonthMoment', () => {
      getStore().dispatch(selectMonth(2017, 0));
      expect(getSelectedMonthMoment(getStore().getState()).format('YYYY-MM-DD HH:mm:ss')).toEqual(
        '2017-01-01 00:00:00'
      );
    });

    test('getPreviousMonthMoment', () => {
      getStore().dispatch(selectMonth(2017, 0));
      expect(getPreviousMonthMoment(getStore().getState()).format('YYYY-MM-DD HH:mm:ss')).toEqual(
        '2016-12-01 00:00:00'
      );
    });

    test('getNextMonthMoment', () => {
      getStore().dispatch(selectMonth(2017, 0));
      expect(getNextMonthMoment(getStore().getState()).format('YYYY-MM-DD HH:mm:ss')).toEqual(
        '2017-02-01 00:00:00'
      );
    });
  });
}
