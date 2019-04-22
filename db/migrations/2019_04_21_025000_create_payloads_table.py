from orator.migrations import Migration

class CreatePayloadsTable(Migration):

    def up(self):
        """
        Run the migrations.
        """
        with self.schema.create('payloads') as table:
            table.increments('id')

            table.string('uuid')
            table.text('payload')

            table.timestamps()


        def down(self):
            """
            Revert the migrations.
            """
            self.schema.drop('payloads')