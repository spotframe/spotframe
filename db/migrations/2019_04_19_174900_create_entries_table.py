from orator.migrations import Migration

class CreateEntriesTable(Migration):

    def up(self):
        """
        Run the migrations.
        """
        with self.schema.create('entries') as table:
            table.increments('id')
            table.integer('version_id').unsigned()
            table.foreign('version_id').references('id').on('versions')
            table.integer('backend_id').unsigned()
            table.foreign('backend_id').references('id').on('backends')

            table.integer('version')

            table.string('key')
            table.string('value')

            table.timestamps()


        def down(self):
            """
            Revert the migrations.
            """
            self.schema.drop('entries')