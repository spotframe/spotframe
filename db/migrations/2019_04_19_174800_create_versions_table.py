from orator.migrations import Migration

class CreateVersionsTable(Migration):

    def up(self):
        """
        Run the migrations.
        """
        with self.schema.create('versions') as table:
            table.increments('id')
            table.integer('backend_id').unsigned()
            table.foreign('backend_id').references('id').on('backends')

            table.integer('version')
            table.string('checksum')

            table.timestamps()


        def down(self):
            """
            Revert the migrations.
            """
            self.schema.drop('versions')