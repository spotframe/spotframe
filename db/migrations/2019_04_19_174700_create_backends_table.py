from orator.migrations import Migration

class CreateBackendsTable(Migration):

    def up(self):
        """
        Run the migrations.
        """
        with self.schema.create('backends') as table:
            table.increments('id')

            table.string('backend')
            table.integer('last_version')

            table.timestamps()


    def down(self):
        """
        Revert the migrations.
        """
        self.schema.drop('backends')