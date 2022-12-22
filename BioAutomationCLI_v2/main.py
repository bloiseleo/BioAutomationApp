import click
from src.Configuration import Configuration
from src.entryServices.PredictSNPEntry import PredictSNPEntry

@click.group()
@click.pass_context
def cli(ctx):
    config = Configuration()
    ctx.obj = dict({
        "config": config
    })

@cli.command(options_metavar="--name \"name\" --refseq \"refseq\" --file \"path_to_file_.xml\" --protein_sequence \"protein sequence\"")
@click.option('--name', default='',metavar="<string>", help="Name of Workspace")
@click.option('--refseq', default='',metavar="<string>", help="Obtained from the RefSeq. This is an identification code for the protein sequence.")
@click.option('--file', default='',metavar="<string>", help="The name of the .xml file downloaded from the dbSNP database.")
@click.option('--protein_sequence', default='',metavar="<string>", help="The name of the .xml file downloaded from the dbSNP database.")
@click.pass_context
def create_workspace(ctx, name, refseq, file, protein_sequence):
    """dbsnp_to_excel is a python function that convert a file a raw .txt file containing information on missense mutations extracted from the dbSNP database and transforms it into an clean dataframe, which is then saved in an excel file (.xlsx)."""
    config = ctx.obj['config']
    config.create_workspace(name, file, refseq, True, protein_sequence)
    click.echo(1)

@cli.command(options_metavar="--name \"workspace name\"")
@click.option('--name', default='',metavar="<string>", help="Name of Workspace")
@click.pass_context
def predict_snp_entry(ctx, name):
    config = ctx.obj['config']
    workspace = config.get_workspace(name)
    entry = PredictSNPEntry(workspace['path_to_base_xlsx'], workspace['protein_sequence'])
    entry.getEntry(workspace['entry']['predictSNP']['path_to_file'])
    config.service_done(name, "entry", "predictSNP")

@cli.command()
@click.pass_context
def list_all_workspaces(ctx):
    config = ctx.obj['config']
    print(config.list_all_workspace())

if __name__ == '__main__':
    cli()
