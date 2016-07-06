/*eslint-env mocha*/
import expect from 'expect';
import * as utils from '../src/selectors/utils';

describe('Selector Utils', function () {
  describe('groupByMultiple', function () {
    it('should work', function () {
      const items = [
        {a: 1, b: 1, c:1},
        {a: 1, b: 3, c:2},
        {a: 2, b: 2, c:3},
        {a: 3, b: 3, c:4},
        {a: 2, b: 2, c:5},
        {a: 1, b: 1, c:6}
      ];
      const expected = new Map();
      expected.set(1, new Map());
      expected.set(2, new Map());
      expected.set(3, new Map());
      expected.get(1).set(1, [
        {a: 1, b: 1, c:1},
        {a: 1, b: 1, c:6}
      ]);
      expected.get(1).set(3, [
        {a: 1, b: 3, c:2}
      ]);
      expected.get(2).set(2, [
        {a: 2, b: 2, c:3},
        {a: 2, b: 2, c:5}
      ]);
      expected.get(3).set(3, [
        {a: 3, b: 3, c:4}
      ]);
      const result = utils.groupBy(items, (i) => i.a, (i) => i.b);
      expect(result).toEqual(expected);
    });
  });
});
