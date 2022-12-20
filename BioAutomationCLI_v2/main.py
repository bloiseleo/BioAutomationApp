import click
from src.Configuration import Configuration

@click.group()
@click.pass_context
def cli(ctx):
    config = Configuration()
    ctx.obj = dict({
        "config": config
    })

@cli.command(options_metavar="--name \"name\" --refseq \"refseq\" --file \"path_to_file_.xml\"")
@click.option('--name', default='',metavar="<string>", help="Name of Workspace")
@click.option('--refseq', default='',metavar="<string>", help="Obtained from the RefSeq. This is an identification code for the protein sequence.")
@click.option('--file', default='',metavar="<string>", help="The name of the .xml file downloaded from the dbSNP database.")
@click.pass_context
def create_workspace(ctx, name, refseq, file):
    """dbsnp_to_excel is a python function that convert a file a raw .txt file containing information on missense mutations extracted from the dbSNP database and transforms it into an clean dataframe, which is then saved in an excel file (.xlsx)."""
    config = ctx.obj['config']
    config.create_workspace(name, file, refseq, True)
    click.echo(1)

if __name__ == '__main__':
    cli()
