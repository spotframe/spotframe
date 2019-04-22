import unittest

import helpers.transformations as enhanced

nodes = {'first': 'node', 'second': {'third': 'node'}}


class TestTransformations(unittest.TestCase):

    def test_get_should_return_by_a_path(self):
        self.assertEqual('node', enhanced.get(nodes, 'second.third'))

    def test_get_should_return_itself_when_no_key(self):
        self.assertEqual(nodes, enhanced.get(nodes, ''))

    def test_get_should_return_none_when_wrong_key(self):
        self.assertIsNone(enhanced.get(nodes, '.sec'))


    def test_translate_should_replace_the_key_with_its_value(self):
        self.assertEqual('my.node', enhanced.translate('my.{second.third}', nodes))


    def test_map_should_map_all_the_dict_children(self):
        self.assertEqual(
            {'first': 'NODE', 'second': {'third': 'NODE'}},
            enhanced.map(nodes, lambda text: text.upper())
        )
